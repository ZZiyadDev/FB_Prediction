from django.db.models import Count, Q
from .models import Prediction

def validate_predictions():
    """
    Finds finished matches with predictions and updates their correctness.
    Optimized to only process unvalidated predictions for finished matches.
    Limited to 100 records per call to prevent backend timeouts.
    """
    pending_predictions = Prediction.objects.filter(
        is_correct__isnull=True,
        match__status__in=['FT', 'AET', 'PEN']
    ).select_related('match').only(
        'id', 'predicted_winner', 'match__score_home', 'match__score_away'
    )[:100]

    if not pending_predictions:
        return 0

    updated_count = 0
    for pred in pending_predictions:
        try:
            match = pred.match
            h = match.score_home
            a = match.score_away

            if h is None or a is None:
                continue
                
            if h > a:
                actual = 'H'
            elif h < a:
                actual = 'A'
            else:
                actual = 'D'
            
            pred.actual_result = actual
            pred.is_correct = (pred.predicted_winner == actual)
            pred.save(update_fields=['actual_result', 'is_correct'])
            updated_count += 1
        except Exception:
            continue
    
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
