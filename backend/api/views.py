from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from .models import Thread, Post, Comment, CommentLike, PostLike
from .serializers import PostSerializer, CustomPostSerializer
from rest_framework.permissions import IsAuthenticated


class PostViewSet(viewsets.ViewSet):

    permission_classes = [IsAuthenticated]

    def list(self, request):
        queryset = Post.objects.all().order_by('-created_date')
        serializer = CustomPostSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='list_by_username/(?P<username>[^/.]+)')
    def list_by_username(self, request, username):
        queryset = Post.objects.filter(thread__user__username=username)
        posts = CustomPostSerializer(queryset, many=True)
        return Response(posts.data)

    def retrieve(self, request, pk=None):
        queryset = Post.objects.all()
        post = get_object_or_404(queryset, pk=pk)
        serializer = CustomPostSerializer(post, many=False)
        return Response(serializer.data)

    def create(self, request):
        user = request.user
        data = request.data.copy()
        data['thread'] = data.get('thread_id')
        data['user'] = user.id

        serializer = PostSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostLikesViewSet(viewsets.ViewSet):
    # permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='like_post')
    def like_post(self, request):
        user = request.user
        post_id = request.data.get('post_id')
        
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({'message': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user in post.likes.all():
            return Response({'message': 'Post already liked.'}, status=status.HTTP_400_BAD_REQUEST)

        post_like = PostLike.objects.create(user=user, post=post)
        post_like.save()

        return Response({'message': 'Post liked successfully.'}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='unlike_post')
    def unlike_post(self, request):
        user = request.user
        data = request.data
        post_id = data.get('post_id')

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({'message': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            post_like = PostLike.objects.get(user=user, post=post)
            post_like.delete()
            return Response({'message': 'Post unliked successfully.'}, status=status.HTTP_200_OK)
        except PostLike.DoesNotExist:
            return Response({'message': 'Post was not liked before.'}, status=status.HTTP_400_BAD_REQUEST)
