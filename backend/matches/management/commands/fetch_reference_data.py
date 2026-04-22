import os
import requests
import time
from django.core.management.base import BaseCommand
from django.conf import settings
from matches.models import League, Season, Team


class Command(BaseCommand):
    help = 'Fetches foundational reference data (Leagues, Seasons, Teams) from API-Football'

    def handle(self, *args, **kwargs):

        api_key = getattr(settings, 'API_FOOTBALL_KEY', None)
        if not api_key:
            self.stderr.write(self.style.ERROR(
                "API_FOOTBALL_KEY is still missing. Please check your .env file name and contents!"
            ))
            return

        headers = {'x-apisports-key': api_key}
        base_url = 'https://v3.football.api-sports.io'

        target_leagues = [39, 140]
        target_seasons = [2022, 2023, 2024]

        self.stdout.write(self.style.SUCCESS("Starting API-Football reference data ingestion..."))

        for league_id in target_leagues:

            self.stdout.write(f"Fetching data for League ID: {league_id}...")

            league_response = requests.get(
                f"{base_url}/leagues",
                headers=headers,
                params={'id': league_id}
            )
            league_data = league_response.json()

            if not league_data.get('response'):
                self.stderr.write(self.style.WARNING(f"No data found for League ID {league_id}"))
                continue

            league_info = league_data['response'][0]['league']

            league_obj, created = League.objects.update_or_create(
                league_id=league_info['id'],
                defaults={
                    'name': league_info['name'],
                    'country': league_data['response'][0]['country']['name'],
                    'logo_url': league_info['logo']
                }
            )

            for season_year in target_seasons:

                Season.objects.update_or_create(
                    league=league_obj,
                    year=season_year,
                    defaults={
                        'start_date': f'{season_year}-08-01',
                        'end_date': f'{season_year + 1}-05-30'
                    }
                )

                self.stdout.write(
                    f"Fetching Teams for {league_obj.name} ({season_year})..."
                )

                teams_response = requests.get(
                    f"{base_url}/teams",
                    headers=headers,
                    params={'league': league_id, 'season': season_year}
                )

                teams_data = teams_response.json()

                if teams_data.get('errors'):
                    self.stderr.write(
                        self.style.ERROR(f"API Error for teams: {teams_data['errors']}")
                    )
                    continue

                for item in teams_data.get('response', []):
                    team_info = item['team']

                    Team.objects.update_or_create(
                        team_id=team_info['id'],
                        defaults={
                            'name': team_info['name'],
                            'code': team_info.get('code'),
                            'logo_url': team_info['logo']
                        }
                    )

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Saved teams for {league_obj.name} season {season_year}"
                    )
                )

                time.sleep(2)

        self.stdout.write(self.style.SUCCESS("Data ingestion complete!"))