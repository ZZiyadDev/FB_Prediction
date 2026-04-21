import numpy as np
from .models import Match
from .services import build_match_features


def build_dataset():
    """
    Builds ML dataset from historical matches.
    X = features
    y = target (match result)
    """

    matches = Match.objects.filter(
        status="finished",
        score_home__isnull=False,
        score_away__isnull=False
    ).order_by("match_date")

    X = []
    y = []

    for match in matches:
        features = build_match_features(match)

        # skip incomplete feature sets
        if not features:
            continue

        X.append([
            features.get("HTGS", 0),
            features.get("ATGS", 0),
            features.get("HTGC", 0),
            features.get("ATGC", 0),
            features.get("HTFormPts", 0),
            features.get("ATFormPts", 0),
            features.get("HTWinStreak3", 0),
            features.get("ATWinStreak3", 0),
            features.get("HTLossStreak3", 0),
            features.get("ATLossStreak3", 0),
        ])

        # target variable
        if match.score_home > match.score_away:
            y.append("H")
        elif match.score_home < match.score_away:
            y.append("A")
        else:
            y.append("D")

    return np.array(X), np.array(y)