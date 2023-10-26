from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer
