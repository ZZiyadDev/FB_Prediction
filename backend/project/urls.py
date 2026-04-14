from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from matches.views import MatchViewSet
from predictions.views import PredictionViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'matches', MatchViewSet)
router.register(r'predictions', PredictionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
