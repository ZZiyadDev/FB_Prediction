from django.contrib.auth.models import User
from rest_framework import viewsets, generics, permissions
from .serializers import UserSerializer, MyTokenObtainPairSerializer
from .permissions import IsAdminRole
from rest_framework_simplejwt.views import TokenObtainPairView

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAdminRole]

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
