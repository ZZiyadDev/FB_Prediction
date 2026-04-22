import os
import joblib
import numpy as np

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from matches.models import Match
from matches.services import build_match_features
from .constants import LABEL_MAP

MODEL_PATH = os.path.join(os.path.dirname(__file__), "xgb_match_model.pkl")

_model = None


def get_model():
    global _model

    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                "Model file not found. Run train.py first to generate xgb_match_model.pkl"
            )

        _model = joblib.load(MODEL_PATH)

    return _model


class PredictionViewSet(viewsets.ViewSet):

    @action(detail=True, methods=["get"])
    def predict(self, request, pk=None):
        try:
            match = Match.objects.get(id=pk)
        except Match.DoesNotExist:
            return Response({"error": "Match not found"}, status=404)

        features = build_match_features(match)

        if not features:
            return Response({"error": "Feature generation failed"}, status=500)

        X = np.array([[
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
        ]])

        model = get_model()

        # prediction class (0/1/2)
        pred_class = model.predict(X)[0]

        # mapping to readable label
        pred_label = LABEL_MAP[pred_class]

        # probabilities
        proba = model.predict_proba(X)[0]

        return Response({
            "match": f"{match.home_team.name} vs {match.away_team.name}",
            "prediction": pred_label,
            "home_win_probability": float(proba[0]),
            "draw_probability": float(proba[1]),
            "away_win_probability": float(proba[2]),
        })