from datetime import timedelta
from django.db.models import Q
from .models import Match


# ----------------------------
# CORE QUERY: past matches only
# ----------------------------
def get_past_matches(team, match_date):
    return Match.objects.filter(
        Q(home_team=team) | Q(away_team=team),
        match_date__lt=match_date,
        status="FT"
    ).order_by('-match_date')


# ----------------------------
# RESULT HELPER
# ----------------------------
def get_match_result(team, match):
    if match.score_home is None or match.score_away is None:
        return 0

    if match.home_team == team:
        if match.score_home > match.score_away:
            return 3
        elif match.score_home == match.score_away:
            return 1
        return 0

    if match.score_away > match.score_home:
        return 3
    elif match.score_home == match.score_away:
        return 1
    return 0


# ----------------------------
# FORM (last N matches points)
# ----------------------------
def calculate_form(team, match_date, n=5):
    matches = get_past_matches(team, match_date)[:n]

    total_points = 0
    for m in matches:
        total_points += get_match_result(team, m)

    return total_points


# ----------------------------
# GOALS SCORED / CONCEDED
# ----------------------------
def goals_stats(team, match_date, n=5):
    matches = get_past_matches(team, match_date)[:n]

    scored = 0
    conceded = 0

    for m in matches:
        if m.home_team == team:
            scored += m.score_home or 0
            conceded += m.score_away or 0
        else:
            scored += m.score_away or 0
            conceded += m.score_home or 0

    return scored, conceded


# ----------------------------
# WIN / LOSS STREAK
# ----------------------------
def streak(team, match_date):
    matches = get_past_matches(team, match_date)

    win_streak = 0
    loss_streak = 0

    for m in matches:
        result = get_match_result(team, m)

        if result == 3:
            win_streak += 1
        elif result == 0:
            loss_streak += 1
        else:
            break

    return win_streak, loss_streak

# ----------------------------
# HEAD-TO-HEAD (H2H)
# ----------------------------
def get_h2h(team1, team2, match_date, n=5):
    matches = Match.objects.filter(
        (Q(home_team=team1, away_team=team2) | Q(home_team=team2, away_team=team1)),
        match_date__lt=match_date,
        status="FT"
    ).order_by('-match_date')[:n]

    t1_points = 0
    for m in matches:
        t1_points += get_match_result(team1, m)
    return t1_points


# ----------------------------
# FATIGUE (Days since last match)
# ----------------------------
def get_fatigue(team, match_date):
    last_match = get_past_matches(team, match_date).first()
    if last_match:
        return (match_date.date() - last_match.match_date.date()).days
    return 14 # default to 14 days if no previous match found



# ----------------------------
# MAIN FEATURE BUILDER
# ----------------------------
def build_match_features(match):
    home = match.home_team
    away = match.away_team
    date = match.match_date

    home_scored, home_conceded = goals_stats(home, date)
    away_scored, away_conceded = goals_stats(away, date)

    home_form = calculate_form(home, date)
    away_form = calculate_form(away, date)

    home_win_streak, home_loss_streak = streak(home, date)
    away_win_streak, away_loss_streak = streak(away, date)

    return {
        "HTGS": home_scored,
        "ATGS": away_scored,
        "HTGC": home_conceded,
        "ATGC": away_conceded,
        "HTFormPts": home_form,
        "ATFormPts": away_form,
        "HTWinStreak3": home_win_streak,
        "ATWinStreak3": away_win_streak,
        "HTLossStreak3": home_loss_streak,
        "ATLossStreak3": away_loss_streak,
    }