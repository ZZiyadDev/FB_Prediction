from django.db import models

class League(models.Model):
    league_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    logo_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class Season(models.Model):
    league = models.ForeignKey(League, related_name='seasons', on_delete=models.CASCADE)
    year = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    # Optional but highly recommended: Store the API's coverage object so you know what data is available
    # coverage = models.JSONField(null=True, blank=True) 

    def __str__(self):
        return f"{self.league.name} - {self.year}"

class Team(models.Model):
    team_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=10, null=True, blank=True) # Sometimes API returns null codes
    logo_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class Match(models.Model):
    fixture_id = models.IntegerField(unique=True) 
    league = models.ForeignKey('League', related_name='matches', on_delete=models.CASCADE)
    season = models.ForeignKey('Season', related_name='matches', on_delete=models.CASCADE)
    home_team = models.ForeignKey('Team', related_name='home_matches', on_delete=models.CASCADE)
    away_team = models.ForeignKey('Team', related_name='away_matches', on_delete=models.CASCADE)
    match_date = models.DateTimeField()
    
    # --- The Target Variables (Outcomes) ---
    score_home = models.IntegerField(null=True, blank=True)
    score_away = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=50, default='scheduled')

    # --- ML Features: Pre-Match State ---
    # These represent the exact state of the team entering the match
    htgs = models.IntegerField(default=0, help_text="Home Team Goals Scored (Season cumulative)")
    atgs = models.IntegerField(default=0, help_text="Away Team Goals Scored (Season cumulative)")
    htgc = models.IntegerField(default=0, help_text="Home Team Goals Conceded")
    atgc = models.IntegerField(default=0, help_text="Away Team Goals Conceded")
    home_form_points = models.IntegerField(default=0, help_text="Points in last 5 matches")
    away_form_points = models.IntegerField(default=0, help_text="Points in last 5 matches")

    def __str__(self):
        return f'{self.home_team.name} vs {self.away_team.name} ({self.match_date.strftime("%Y-%m-%d")})'


class MatchStatistics(models.Model):
    """
    Stores historical performance data used to calculate future form.
    Linked 1-to-1 with a Match.
    """
    match = models.OneToOneField(Match, related_name='statistics', on_delete=models.CASCADE)
    
    home_possession = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    away_possession = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    home_shots_on_target = models.IntegerField(null=True, blank=True)
    away_shots_on_target = models.IntegerField(null=True, blank=True)
    
    home_corners = models.IntegerField(null=True, blank=True)
    away_corners = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Stats for {self.match}"


class MatchOdds(models.Model):
    """
    Pre-match bookmaker odds (e.g., 1x2 market). 
    A highly valuable feature for machine learning.
    """
    match = models.OneToOneField(Match, related_name='odds', on_delete=models.CASCADE)
    
    home_win_odds = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    draw_odds = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    away_win_odds = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"Odds for {self.match}"