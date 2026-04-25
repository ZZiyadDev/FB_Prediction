import os
import joblib
import numpy as np

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from matches.models import Match
from matches.services import build_match_features


MODEL_PATH = os.path.join(os.path.dirname(__file__), "xgb_match_model.pkl")
ENCODER_PATH = os.path.join(os.path.dirname(__file__), "label_encoder.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "scaler.pkl")

_model = None
_encoder = None
_scaler = None


def load_model():
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model


def load_encoder():
    global _encoder
    if _encoder is None:
        _encoder = joblib.load(ENCODER_PATH)
    return _encoder


def load_scaler():
    global _scaler
    if _scaler is None:
        _scaler = joblib.load(SCALER_PATH)
    return _scaler


class PredictionViewSet(viewsets.ViewSet):

    @action(detail=True, methods=["get"])
    def predict(self, request, pk=None):

        match = Match.objects.filter(id=pk).first()
        if not match:
            return Response({"error": "Match not found"}, status=404)

        f = build_match_features(match)
        if not f:
            return Response({"error": "Feature generation failed"}, status=500)

        X = np.array([[
            f.get("HTGS", 0),
            f.get("ATGS", 0),
            f.get("HTGC", 0),
            f.get("ATGC", 0),
            f.get("HTFormPts", 0),
            f.get("ATFormPts", 0),
            f.get("HTWinStreak3", 0),
            f.get("ATWinStreak3", 0),
            f.get("HTLossStreak3", 0),
            f.get("ATLossStreak3", 0),

            f.get("HTGS", 0) - f.get("ATGS", 0),
            f.get("HTGC", 0) - f.get("ATGC", 0),
            f.get("HTFormPts", 0) - f.get("ATFormPts", 0),

            (f.get("HTGS", 0) / (f.get("ATGS", 1))),
            (f.get("HTGC", 0) / (f.get("ATGC", 1))),
            (f.get("HTFormPts", 0) / (f.get("ATFormPts", 1))),
        ]])

        scaler = load_scaler()
        model = load_model()
        encoder = load_encoder()

        X = scaler.transform(X)

        pred_class = model.predict(X)[0]
        pred_label = encoder.inverse_transform([pred_class])[0]
        proba = model.predict_proba(X)[0]

        return Response({
            "match": f"{match.home_team.name} vs {match.away_team.name}",
            "prediction": pred_label,
            "H": float(proba[encoder.transform(['H'])[0]]),
            "D": float(proba[encoder.transform(['D'])[0]]),
            "A": float(proba[encoder.transform(['A'])[0]])
        })