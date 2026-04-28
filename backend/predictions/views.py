import os
import joblib
import numpy as np

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from matches.models import Match
from matches.services import build_match_features
from django.conf import settings


MODEL_PATH = os.path.join(settings.BASE_DIR, "xgb_match_model.pkl")
ENCODER_PATH = os.path.join(settings.BASE_DIR, "label_encoder.pkl")
SCALER_PATH = os.path.join(settings.BASE_DIR, "scaler.pkl")

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


# Helper function matching the exact math used in dataset_builder.py
def safe_div(a, b):
    return a / (b + 1e-6)


class PredictionViewSet(viewsets.ViewSet):

    @action(detail=True, methods=["get"])
    def predict(self, request, pk=None):

        match = Match.objects.filter(id=pk).first()
        if not match:
            return Response({"error": "Match not found"}, status=404)

        f = build_match_features(match)
        if not f:
            return Response({"error": "Feature generation failed"}, status=500)

        # 1. Calculate values EXACTLY how dataset_builder.py did it
        htgs = f.get("HTGS", 0)
        atgs = f.get("ATGS", 0)
        htgc = f.get("HTGC", 0)
        atgc = f.get("ATGC", 0)
        hform = f.get("HTFormPts", 0)
        aform = f.get("ATFormPts", 0)

        goal_diff = htgs - atgs
        concede_diff = htgc - atgc
        form_diff = hform - aform

        goal_ratio = safe_div(htgs, atgs)
        concede_ratio = safe_div(htgc, atgc)
        form_ratio = safe_div(hform, aform)

        # 2. MUST BE EXACTLY 19 FEATURES IN THE EXACT SAME ORDER
        X = np.array([[
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
            
            f.get("H2H_Pts", 0),      # Feature 17
            f.get("HT_Fatigue", 14),  # Feature 18
            f.get("AT_Fatigue", 14),  # Feature 19
        ]])

        try:
            scaler = load_scaler()
            model = load_model()
            encoder = load_encoder()
        except Exception as e:
            return Response({"error": f"AI models not found. Did you train it? {str(e)}"}, status=503)

        try:
            # Squash the numbers, just like in training
            X_scaled = scaler.transform(X)

            # Predict
            pred_class = model.predict(X_scaled)[0]
            pred_label = encoder.inverse_transform([pred_class])[0]
            proba = model.predict_proba(X_scaled)[0]

            # Build a clean dictionary for the frontend (e.g., {"H": 45.2, "D": 22.1, "A": 32.7})
            classes = encoder.classes_
            confidence_scores = {
                classes[i]: round(float(prob) * 100, 2) 
                for i, prob in enumerate(proba)
            }

            return Response({
                "match": f"{match.home_team.name} vs {match.away_team.name}",
                "prediction": pred_label,
                "confidence_scores": confidence_scores
            })
            
        except Exception as e:
            return Response({"error": f"Prediction pipeline failed: {str(e)}"}, status=500)