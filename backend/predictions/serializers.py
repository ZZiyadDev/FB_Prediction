from rest_framework import serializers
from .models import Prediction

class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = ['id', 'match', 'predicted_winner', 'confidence', 'created_by', 'created_at']
        read_only_fields = ['created_by', 'created_at']
