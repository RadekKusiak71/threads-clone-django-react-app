from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import PostViewSet, PostLikesViewSet, ThreadsViewSet, CommentsViewSet

router = DefaultRouter()

router.register(r'posts', PostViewSet, basename='post')
router.register(r'likes', PostLikesViewSet, basename='like')
router.register(r'threads', ThreadsViewSet, basename='thread')
router.register(r'comments', CommentsViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
]
