from rest_framework import serializers
from .models import Match

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['id', 'home_team', 'away_team', 'match_date', 'score_home', 'score_away', 'status']
