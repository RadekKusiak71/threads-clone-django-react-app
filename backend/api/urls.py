from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import PostViewSet


router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')

urlpatterns = router.urls
