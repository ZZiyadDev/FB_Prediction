import time
import requests
from django.utils import timezone
from django.core.management.base import BaseCommand
from django.conf import settings
from matches.models import Match, MatchLineup

class Command(BaseCommand):
    help = 'Fetches match lineups with batch limits for Free Tier API users.'

    def handle(self, *args, **kwargs):
        api_key = getattr(settings, 'API_FOOTBALL_KEY', None)
        if not api_key:
            self.stderr.write(self.style.ERROR("API Key missing!"))
            return

        headers = {'x-apisports-key': api_key}
        base_url = getattr(settings, 'FOOTBALL_API_BASE_URL', 'https://v3.football.api-sports.io')

        # FREE TIER OPTIMIZATION: 
        # 1. Fetch only Finished matches (FT)
        # 2. Limit to 20 matches per run to save your daily 100-request quota
        matches_to_fetch = Match.objects.filter(
            status="FT",
            lineup__isnull=True,
            match_date__lte=timezone.now()
        ).order_by('-match_date')[:20]

        total_matches = matches_to_fetch.count()
        if total_matches == 0:
            self.stdout.write(self.style.SUCCESS("No matches in DB needing lineup sync today."))
            return

        self.stdout.write(self.style.SUCCESS(f"Processing batch of {total_matches} matches (Daily Quota Protection)..."))

        for match in matches_to_fetch:
            self.stdout.write(f"Syncing: {match.home_team.name} vs {match.away_team.name}...")
            
            response = requests.get(
                f"{base_url}/fixtures/lineups",
                headers=headers,
                params={'fixture': match.fixture_id}
            )
            
            data = response.json()

            # 🚨 CRITICAL: Check for Daily Limit Error
            errors = data.get('errors', {})
            if isinstance(errors, dict) and errors.get('requests'):
                self.stderr.write(self.style.ERROR("\n❌ Daily Request Limit Reached!"))
                self.stderr.write(self.style.WARNING("The script is stopping to protect your API key. Try again after midnight UTC."))
                break
            
            if errors:
                self.stderr.write(self.style.ERROR(f"API Error: {errors}"))
                continue

            results = data.get('response', [])
            
            if not results:
                # Create an empty record to avoid re-fetching this match tomorrow
                MatchLineup.objects.create(match=match)
                self.stdout.write(self.style.WARNING(f"⚠️ No lineups available in API for {match.fixture_id}. Marked as skipped."))
            else:
                home_data = next((t for t in results if t['team']['id'] == match.home_team.team_id), None)
                away_data = next((t for t in results if t['team']['id'] == match.away_team.team_id), None)

                if home_data and away_data:
                    MatchLineup.objects.create(
                        match=match,
                        home_formation=home_data.get('formation'),
                        away_formation=away_data.get('formation'),
                        home_xi=[p['player'] for p in home_data.get('startXI', [])],
                        away_xi=[p['player'] for p in away_data.get('startXI', [])],
                        home_substitutes=[p['player'] for p in home_data.get('substitutes', [])],
                        away_substitutes=[p['player'] for p in away_data.get('substitutes', [])],
                    )
                    self.stdout.write(self.style.SUCCESS(f"✅ Lineup synced!"))
            
            # Rate limiting sleep (10 requests per minute max)
            time.sleep(6.2)

        self.stdout.write(self.style.SUCCESS("\nBatch processing complete."))
