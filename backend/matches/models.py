from django.db import models

class Match(models.Model):
    home_team = models.CharField(max_length=100)
    away_team = models.CharField(max_length=100)
    match_date = models.DateTimeField()
    score_home = models.IntegerField(null=True, blank=True)
    score_away = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, default='scheduled')

    def __str__(self):
        return f'{self.home_team} vs {self.away_team}'
