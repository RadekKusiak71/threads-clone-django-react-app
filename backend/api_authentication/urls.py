from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RegisterViewSet, MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/',
         RegisterViewSet.as_view({'post': 'post'}), name='register'),
]
