from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import PostViewSet, PostLikesViewSet, ThreadsViewSet

post_router = DefaultRouter()
post_router.register(r'posts', PostViewSet, basename='post')

likes_router = DefaultRouter()
likes_router.register(r'likes', PostLikesViewSet, basename='like')

threads_router = DefaultRouter()
threads_router.register(r'threads', ThreadsViewSet, basename='thread')

urlpatterns = [
    path('', include(post_router.urls)),
    path('', include(likes_router.urls)),
    path('', include(threads_router.urls)),
]
