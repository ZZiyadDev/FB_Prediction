from django.db.models import Count, Q
from .models import Prediction

def validate_single_prediction(prediction):
    """
    Validates a single prediction against its match result.
    """
    match = prediction.match
    if match.status not in ['FT', 'AET', 'PEN']:
        return False
        
    h = match.score_home
    a = match.score_away

    if h is None or a is None:
        return False
        
    if h > a:
        actual = 'H'
    elif h < a:
        actual = 'A'
    else:
        actual = 'D'
    
    prediction.actual_result = actual
    prediction.is_correct = (prediction.predicted_winner == actual)
    prediction.save(update_fields=['actual_result', 'is_correct'])
    return True

def validate_predictions():
    """
    Finds finished matches with predictions and updates their correctness.
    Optimized to only process unvalidated predictions for finished matches.
    """
    pending_predictions = Prediction.objects.filter(
        is_correct__isnull=True,
        match__status__in=['FT', 'AET', 'PEN']
    ).select_related('match')[:100]

    updated_count = 0
    for pred in pending_predictions:
        if validate_single_prediction(pred):
            updated_count += 1
    
    return updated_count

def get_accuracy_metrics():
    """
    Returns global and period-based accuracy stats.
    """
    total = Prediction.objects.filter(is_correct__isnull=False).count()
    correct = Prediction.objects.filter(is_correct=True).count()
    
    accuracy = round((correct / total) * 100, 1) if total > 0 else 0
    
    return {
        "total_predictions": total,
        "correct_predictions": correct,
        "accuracy_percentage": accuracy
    }
