# matches/serializers.py
from rest_framework import serializers
from .models import Match, Team, League

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['team_id', 'name', 'code', 'logo_url']

class MatchSerializer(serializers.ModelSerializer):
    # This nests the full team JSON inside the match JSON!
    home_team = TeamSerializer(read_only=True)
    away_team = TeamSerializer(read_only=True)
    
    # Flatten the league name for easy access in React
    league_name = serializers.CharField(source='league.name', read_only=True)

    class Meta:
        model = Match
        fields = [
            'id', 'fixture_id', 'match_date', 'status',
            'score_home', 'score_away', 
            'home_team', 'away_team', 'league_name',
            'htgs', 'atgs', 'htgc', 'atgc', 
            'home_form_points', 'away_form_points'
        ]