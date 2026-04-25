import numpy as np
from .models import Match
from .services import build_match_features


def safe_div(a, b):
    return a / (b + 1e-6)


def build_dataset():
    matches = Match.objects.filter(
        status="FT",
        score_home__isnull=False,
        score_away__isnull=False
    ).order_by("match_date")

    X, y = [], []

    for match in matches:
        f = build_match_features(match)
        if not f:
            continue

        htgs = f.get("HTGS", 0)
        atgs = f.get("ATGS", 0)
        htgc = f.get("HTGC", 0)
        atgc = f.get("ATGC", 0)
        hform = f.get("HTFormPts", 0)
        aform = f.get("ATFormPts", 0)

        # core differences (stable signal)
        goal_diff = htgs - atgs
        concede_diff = htgc - atgc
        form_diff = hform - aform

        # normalized ratios (fixed stability)
        goal_ratio = safe_div(htgs, atgs)
        concede_ratio = safe_div(htgc, atgc)
        form_ratio = safe_div(hform, aform)

        X.append([
            htgs, atgs,
            htgc, atgc,
            hform, aform,

            f.get("HTWinStreak3", 0),
            f.get("ATWinStreak3", 0),
            f.get("HTLossStreak3", 0),
            f.get("ATLossStreak3", 0),

            goal_diff,
            concede_diff,
            form_diff,

            goal_ratio,
            concede_ratio,
            form_ratio,
        ])

        if match.score_home > match.score_away:
            y.append("H")
        elif match.score_home < match.score_away:
            y.append("A")
        else:
            y.append("D")

    return np.array(X), np.array(y)