import os
import requests
import time
from django.core.management.base import BaseCommand
from django.conf import settings
from matches.models import League, Season, Team 

class Command(BaseCommand):
    help = 'Fetches foundational reference data (Leagues, Seasons, Teams) from API-Football'

    def handle(self, *args, **kwargs):
        # Retrieve the API key 
        api_key = getattr(settings, 'API_FOOTBALL_KEY', None)
        if not api_key:
            self.stderr.write(self.style.ERROR("API_FOOTBALL_KEY is still missing. Please check your .env file name and contents!"))
            return

        headers = {'x-apisports-key': api_key}
        base_url = 'https://v3.football.api-sports.io'

        # Target specific leagues to save your quota!
        # 39: Premier League (England), 140: La Liga (Spain)
        target_leagues = [39, 140]
        target_season = 2024

        self.stdout.write(self.style.SUCCESS("Starting API-Football reference data ingestion..."))

        for league_id in target_leagues:
            self.stdout.write(f"Fetching data for League ID: {league_id}...")
            
            # --- 1. Fetch and Save League & Season ---
            league_response = requests.get(f"{base_url}/leagues", headers=headers, params={'id': league_id})
            league_data = league_response.json()

            if not league_data.get('response'):
                self.stderr.write(self.style.WARNING(f"No data found for League ID {league_id}"))
                continue

            league_info = league_data['response'][0]['league']
            
            # Using update_or_create prevents duplicates if you run the script twice
            league_obj, created = League.objects.update_or_create(
                league_id=league_info['id'],
                defaults={
                    'name': league_info['name'],
                    'country': league_data['response'][0]['country']['name'],
                    'logo_url': league_info['logo']
                }
            )

            # Save the specific target season
            Season.objects.update_or_create(
                league=league_obj,
                year=target_season,
                defaults={
                    'start_date': '2024-08-01', # In a real scenario, extract this from the API response
                    'end_date': '2025-05-30'
                }
            )

            # --- 2. Fetch and Save Teams for this League/Season ---
            self.stdout.write(f"Fetching Teams for {league_obj.name} ({target_season})...")
            teams_response = requests.get(
                f"{base_url}/teams", 
                headers=headers, 
                params={'league': league_id, 'season': target_season}
            )
            teams_data = teams_response.json()

            # --- ADD THESE 3 LINES TO CATCH THE ERROR ---
            if teams_data.get('errors'):
                self.stderr.write(self.style.ERROR(f"API Error for teams: {teams_data['errors']}"))
                continue
            # --------------------------------------------

            for item in teams_data.get('response', []):
                team_info = item['team']
                
                Team.objects.update_or_create(
                    team_id=team_info['id'],
                    defaults={
                        'name': team_info['name'],
                        'code': team_info.get('code'), # Uses .get() safely in case 'code' is missing
                        'logo_url': team_info['logo']
                    }
                )
            
            self.stdout.write(self.style.SUCCESS(f"Successfully saved {len(teams_data.get('response', []))} teams for {league_obj.name}."))
            
            # Sleep briefly to respect API rate limits (avoiding hitting the per-minute cap)
            time.sleep(2)

        self.stdout.write(self.style.SUCCESS("Data ingestion complete!"))