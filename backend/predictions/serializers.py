from rest_framework import serializers
from .models import Prediction
from matches.models import Match

class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = ['id', 'match', 'predicted_winner', 'confidence', 'is_correct', 'actual_result', 'created_by', 'created_at']
        read_only_fields = ['created_by', 'created_at']

class PredictionHistorySerializer(serializers.ModelSerializer):
    home_team = serializers.CharField(source='match.home_team.name')
    away_team = serializers.CharField(source='match.away_team.name')
    home_logo = serializers.URLField(source='match.home_team.logo_url')
    away_logo = serializers.URLField(source='match.away_team.logo_url')
    match_date = serializers.DateTimeField(source='match.match_date')
    score_home = serializers.IntegerField(source='match.score_home')
    score_away = serializers.IntegerField(source='match.score_away')
    status = serializers.CharField(source='match.status')

    class Meta:
        model = Prediction
        fields = [
            'id', 'predicted_winner', 'confidence', 'is_correct', 'actual_result',
            'home_team', 'away_team', 'home_logo', 'away_logo', 
            'match_date', 'score_home', 'score_away', 'status', 'created_at'
        ]
