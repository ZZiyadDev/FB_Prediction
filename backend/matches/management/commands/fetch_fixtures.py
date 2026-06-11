import requests
from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils.dateparse import parse_datetime
from matches.models import League, Season, Team, Match 
from predictions.services import validate_predictions

class Command(BaseCommand):
    help = 'Fetches all fixtures (matches) for our saved leagues and seasons'

    def handle(self, *args, **kwargs):
        api_key = getattr(settings, 'API_FOOTBALL_KEY', None)
        if not api_key:
            self.stderr.write(self.style.ERROR("API Key missing!"))
            return

        headers = {'x-apisports-key': api_key}
        base_url = getattr(settings, 'FOOTBALL_API_BASE_URL', 'https://v3.football.api-sports.io')

        # We will loop through the seasons we already saved in the database
        saved_seasons = Season.objects.all()
        
        if not saved_seasons.exists():
            self.stderr.write(self.style.ERROR("No seasons found in the database. Run fetch_reference_data first."))
            return

        self.stdout.write(self.style.SUCCESS("Starting Fixture ingestion..."))

        for season in saved_seasons:
            self.stdout.write(f"Fetching fixtures for {season.league.name} ({season.year})...")
            
            # The single API call that gets the whole season schedule
            response = requests.get(
                f"{base_url}/fixtures", 
                headers=headers, 
                params={'league': season.league.league_id, 'season': season.year}
            )
            data = response.json()

            if data.get('errors'):
                self.stderr.write(self.style.ERROR(f"API Error: {data['errors']}"))
                continue

            fixtures = data.get('response', [])
            matches_created = 0

            for item in fixtures:
                fixture_info = item['fixture']
                teams_info = item['teams']
                goals_info = item['goals']

                # Find the teams in our local database
                try:
                    home_team = Team.objects.get(team_id=teams_info['home']['id'])
                    away_team = Team.objects.get(team_id=teams_info['away']['id'])
                except Team.DoesNotExist:
                    # Skip matches if we don't have the teams saved
                    continue

                # Save the match!
                Match.objects.update_or_create(
                    fixture_id=fixture_info['id'],
                    defaults={
                        'league': season.league,
                        'season': season,
                        'home_team': home_team,
                        'away_team': away_team,
                        'match_date': parse_datetime(fixture_info['date']),
                        'status': fixture_info['status']['short'],
                        'score_home': goals_info['home'],
                        'score_away': goals_info['away']
                    }
                )
                matches_created += 1

            self.stdout.write(self.style.SUCCESS(f"Saved {matches_created} matches for {season.league.name}."))

        self.stdout.write(self.style.SUCCESS("Fixture ingestion complete!"))

        # Trigger AI Prediction validation
        self.stdout.write("Validating AI predictions against new results...")
        count = validate_predictions()
        self.stdout.write(self.style.SUCCESS(f"Validated {count} pending predictions."))