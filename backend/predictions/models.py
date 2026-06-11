from django.conf import settings
from django.db import models
from matches.models import Match

class Prediction(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='predictions')
    predicted_winner = models.CharField(max_length=10, help_text="H, D, or A")
    actual_result = models.CharField(max_length=10, null=True, blank=True, help_text="H, D, or A")
    is_correct = models.BooleanField(null=True, blank=True)
    confidence = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='predictions',
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.predicted_winner} for {self.match} (Correct: {self.is_correct})'
