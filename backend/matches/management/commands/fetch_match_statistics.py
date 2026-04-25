import time
import requests
from django.core.management.base import BaseCommand
from django.conf import settings
from matches.models import Match, MatchStatistics

class Command(BaseCommand):
    help = 'Fetches match statistics for completed matches in the current season.'

    def handle(self, *args, **kwargs):
        api_key = getattr(settings, 'API_FOOTBALL_KEY', None)
        if not api_key:
            self.stderr.write(self.style.ERROR("API Key missing!"))
            return

        headers = {'x-apisports-key': api_key}
        base_url = getattr(settings, 'FOOTBALL_API_BASE_URL', 'https://v3.football.api-sports.io')

        # Get the latest season year from the DB
        # Assuming the highest year is the current season
        latest_match = Match.objects.order_by('-season__year').first()
        if not latest_match:
            self.stderr.write(self.style.ERROR("No matches found in the database."))
            return
            
        current_year = latest_match.season.year

        # Get FT matches from the current season that don't have statistics yet
        matches_to_fetch = Match.objects.filter(
            season__year=current_year,
            status="FT",
            statistics__isnull=True
        )

        total_matches = matches_to_fetch.count()
        self.stdout.write(self.style.SUCCESS(f"Found {total_matches} matches from season {current_year} needing statistics."))

        if total_matches == 0:
            return

        matches_processed = 0
        
        # We process matches in a loop. Note: API-Sports has rate limits!
        # You might want to limit this or add sleep if processing a huge batch.
        for match in matches_to_fetch:
            self.stdout.write(f"Fetching stats for Match {match.fixture_id} ({match.home_team.name} vs {match.away_team.name})...")
            
            response = requests.get(
                f"{base_url}/fixtures/statistics",
                headers=headers,
                params={'fixture': match.fixture_id}
            )
            
            if response.status_code != 200:
                self.stderr.write(self.style.ERROR(f"HTTP Error {response.status_code} for match {match.fixture_id}"))
                time.sleep(1) # Small delay on error
                continue
                
            data = response.json()

            if data.get('errors'):
                self.stderr.write(self.style.ERROR(f"API Error for match {match.fixture_id}: {data['errors']}"))
                # If rate limit exceeded, we should probably stop
                if 'rateLimit' in data.get('errors', {}):
                    self.stderr.write(self.style.ERROR("Rate limit hit. Stopping script."))
                    break
                time.sleep(1)
                continue

            results = data.get('response', [])
            
            if not results:
                self.stdout.write(self.style.WARNING(f"No statistics found for match {match.fixture_id}. Creating empty stats record to avoid re-fetching."))
                MatchStatistics.objects.create(match=match)
                continue

            # Parse the stats for home and away
            home_stats_data = None
            away_stats_data = None
            
            for team_data in results:
                if team_data['team']['id'] == match.home_team.team_id:
                    home_stats_data = team_data['statistics']
                elif team_data['team']['id'] == match.away_team.team_id:
                    away_stats_data = team_data['statistics']
                    
            if not home_stats_data or not away_stats_data:
                self.stderr.write(self.style.ERROR(f"Incomplete statistics data for match {match.fixture_id}"))
                continue

            # Helper function to parse values
            def parse_stat(stats_list, stat_type, is_percent=False):
                for item in stats_list:
                    if item['type'] == stat_type:
                        val = item['value']
                        if val is None:
                            return None
                        if is_percent and isinstance(val, str) and val.endswith('%'):
                            return float(val.strip('%'))
                        try:
                            return int(val)
                        except (ValueError, TypeError):
                            return None
                return None

            try:
                # Create the MatchStatistics object
                MatchStatistics.objects.create(
                    match=match,
                    
                    home_possession=parse_stat(home_stats_data, "Ball Possession", is_percent=True),
                    away_possession=parse_stat(away_stats_data, "Ball Possession", is_percent=True),
                    
                    home_shots_on_target=parse_stat(home_stats_data, "Shots on Goal"),
                    away_shots_on_target=parse_stat(away_stats_data, "Shots on Goal"),
                    
                    home_shots_off_target=parse_stat(home_stats_data, "Shots off Goal"),
                    away_shots_off_target=parse_stat(away_stats_data, "Shots off Goal"),
                    
                    home_total_shots=parse_stat(home_stats_data, "Total Shots"),
                    away_total_shots=parse_stat(away_stats_data, "Total Shots"),
                    
                    home_blocked_shots=parse_stat(home_stats_data, "Blocked Shots"),
                    away_blocked_shots=parse_stat(away_stats_data, "Blocked Shots"),
                    
                    home_shots_inside_box=parse_stat(home_stats_data, "Shots insidebox"),
                    away_shots_inside_box=parse_stat(away_stats_data, "Shots insidebox"),
                    
                    home_shots_outside_box=parse_stat(home_stats_data, "Shots outsidebox"),
                    away_shots_outside_box=parse_stat(away_stats_data, "Shots outsidebox"),
                    
                    home_fouls=parse_stat(home_stats_data, "Fouls"),
                    away_fouls=parse_stat(away_stats_data, "Fouls"),
                    
                    home_yellow_cards=parse_stat(home_stats_data, "Yellow Cards"),
                    away_yellow_cards=parse_stat(away_stats_data, "Yellow Cards"),
                    
                    home_red_cards=parse_stat(home_stats_data, "Red Cards"),
                    away_red_cards=parse_stat(away_stats_data, "Red Cards"),
                    
                    home_corners=parse_stat(home_stats_data, "Corner Kicks"),
                    away_corners=parse_stat(away_stats_data, "Corner Kicks"),
                    
                    home_offsides=parse_stat(home_stats_data, "Offsides"),
                    away_offsides=parse_stat(away_stats_data, "Offsides"),
                    
                    home_goalkeeper_saves=parse_stat(home_stats_data, "Goalkeeper Saves"),
                    away_goalkeeper_saves=parse_stat(away_stats_data, "Goalkeeper Saves"),
                    
                    home_total_passes=parse_stat(home_stats_data, "Total passes"),
                    away_total_passes=parse_stat(away_stats_data, "Total passes"),
                    
                    home_passes_accurate=parse_stat(home_stats_data, "Passes accurate"),
                    away_passes_accurate=parse_stat(away_stats_data, "Passes accurate"),
                    
                    home_passes_percentage=parse_stat(home_stats_data, "Passes %", is_percent=True),
                    away_passes_percentage=parse_stat(away_stats_data, "Passes %", is_percent=True),
                )
                matches_processed += 1
                
                # API-Sports rate limit is generally 10 requests / second.
                # Adding a small delay to be safe.
                time.sleep(0.15)
                
            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Error parsing stats for match {match.fixture_id}: {str(e)}"))

        self.stdout.write(self.style.SUCCESS(f"Successfully processed statistics for {matches_processed} matches."))
