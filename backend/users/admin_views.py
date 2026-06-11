from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.management import call_command
from users.permissions import IsAdminRole
import threading

class AdminActionsViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminRole]

    @action(detail=False, methods=['post'])
    def fetch_fixtures(self, request):
        """
        Trigger the fetch_fixtures command in the background.
        """
        try:
            # We run it in a thread to avoid blocking the request
            thread = threading.Thread(target=call_command, args=('fetch_fixtures',))
            thread.start()
            return Response({"message": "Fetching fixtures started in the background."}, status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def fetch_statistics(self, request):
        """
        Trigger the fetch_match_statistics command in the background.
        """
        try:
            thread = threading.Thread(target=call_command, args=('fetch_match_statistics',))
            thread.start()
            return Response({"message": "Fetching statistics started in the background."}, status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def fetch_lineups(self, request):
        """
        Trigger the fetch_match_lineups command in the background.
        """
        try:
            thread = threading.Thread(target=call_command, args=('fetch_match_lineups',))
            thread.start()
            return Response({"message": "Fetching lineups started in the background."}, status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
