from rest_framework import viewsets, permissions
from .models import Match
from .serializers import MatchSerializer

class MatchViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    """
    A ViewSet for viewing matches. 
    We use ReadOnlyModelViewSet so the React frontend can only READ the data,
    preventing accidental deletions of the data we just fetched from the API.
    """
    # Order matches by date so the most recent/upcoming ones are first
    queryset = Match.objects.select_related('home_team', 'away_team', 'league', 'season', 'statistics', 'lineup').order_by('-match_date')
    serializer_class = MatchSerializer
