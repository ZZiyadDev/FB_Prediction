from datetime import timedelta
from django.db.models import Q
from .models import Match
from .models import Match, MatchStatistics


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

# ----------------------------
# DEEP STATS (Rolling Averages)
# ----------------------------

def safe_stat(value):
    """Safely converts API strings like '54%' to floats."""
    if not value:
        return None
    if isinstance(value, str):
        value = value.replace('%', '').strip()
    try:
        return float(value)
    except ValueError:
        return None


def get_form_string(team, match_date, n=5):
    """Calculates the W/D/L form string for a team's last N matches."""
    # We use your existing function to get the past 5 games
    matches = get_past_matches(team, match_date)[:n]
    
    form_string = ""
    
    for m in matches:
        # Determine if the team was Home or Away for this past match
        if m.home_team == team:
            if m.score_home > m.score_away:
                form_string += "W"
            elif m.score_home == m.score_away:
                form_string += "D"
            else:
                form_string += "L"
        else:
            if m.score_away > m.score_home:
                form_string += "W"
            elif m.score_away == m.score_home:
                form_string += "D"
            else:
                form_string += "L"
                
    # Optional: Reverse the string so the most recent match is on the right side
    return form_string[::-1]

def deep_stats_average(team, match_date, n=5):
    # 1. Expand the search window to 30 past matches to survive sparse data
    matches = get_past_matches(team, match_date)[:30] 
    
    total_possession, count_possession = 0, 0
    total_shots, count_shots = 0, 0
    total_passes, count_passes = 0, 0
    
    valid_matches_found = 0 # Track how many matches with real stats we found
    
    for m in matches:
        if valid_matches_found >= n:
            break # We successfully found 5 matches with data! Stop searching.
            
        # 2. Bulletproof ORM Check: Handle any way Django named the database connection
        stats = None
        if hasattr(m, 'matchstatistics') and m.matchstatistics is not None:
            stats = m.matchstatistics
        elif hasattr(m, 'statistics') and m.statistics is not None:
            stats = m.statistics
        elif hasattr(m, 'matchstatistics_set') and hasattr(m.matchstatistics_set, 'first'):
            stats = m.matchstatistics_set.first()
            
        if not stats:
            continue # This match has no stats due to API limits. Skip it and look older.
            
        valid_matches_found += 1 # We found one!
        
        # Safely parse the strings!
        if m.home_team == team:
            poss = safe_stat(stats.home_possession)
            shots = safe_stat(stats.home_shots_on_target)
            passes = safe_stat(stats.home_passes_percentage)
        else:
            poss = safe_stat(stats.away_possession)
            shots = safe_stat(stats.away_shots_on_target)
            passes = safe_stat(stats.away_passes_percentage)
            
        if poss is not None:
            total_possession += poss
            count_possession += 1
        if shots is not None:
            total_shots += shots
            count_shots += 1
        if passes is not None:
            total_passes += passes
            count_passes += 1
                
    # Calculate averages
    avg_possession = (total_possession / count_possession) if count_possession > 0 else 50.0
    avg_shots = (total_shots / count_shots) if count_shots > 0 else 0.0
    avg_passes = (total_passes / count_passes) if count_passes > 0 else 75.0
    
    return avg_possession, avg_shots, avg_passes

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
    
    # --- CALCULATE NEW DEEP STATS ---
    ht_poss, ht_shots, ht_pass = deep_stats_average(home, date)
    at_poss, at_shots, at_pass = deep_stats_average(away, date)

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
        
        # --- ADD TO DICTIONARY ---
        "HT_Possession": ht_poss,
        "AT_Possession": at_poss,
        "HT_ShotsOnTarget": ht_shots,
        "AT_ShotsOnTarget": at_shots,
        "HT_PassAccuracy": ht_pass,
        "AT_PassAccuracy": at_pass,
        
        "H2H_Pts": get_h2h(home, away, date),
        "HT_Fatigue": get_fatigue(home, date),
        "AT_Fatigue": get_fatigue(away, date)
    }