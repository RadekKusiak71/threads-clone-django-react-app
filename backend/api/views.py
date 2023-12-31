

from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from .models import Thread, Post, Comment, CommentLike, PostLike
from .serializers import PostSerializer, CustomPostSerializer, ThreadSerializer, CommentSerializer, CreateCommentSerializer
from rest_framework.permissions import IsAuthenticated


class CommentsViewSet(viewsets.ViewSet):
    # permission_classes = [IsAuthenticated]

    def list(self, request, pk=None):
        queryset = Comment.objects.all().order_by('-created_date')
        data = CommentSerializer(queryset, many=True)
        return Response(data.data)

    def retrieve(self, request, pk=None):
        queryset = Comment.objects.get(id=pk)
        data = CommentSerializer(queryset, many=False)
        return Response(data.data)

    @action(detail=False, methods=['get'], url_path='comments_for_posts/(?P<post_id>[^/.]+)')
    def comments_for_posts(self, request, post_id=None):
        queryset = Comment.objects.filter(post_id=post_id).order_by('-created_date')
        data = CommentSerializer(queryset, many=True)
        return Response(data.data)

    def create(self, request):
        data = request.data.copy()
        print(data)
        post_id = data.get('post_id')
        thread_id = data.get('thread_id')
        try:
            post = Post.objects.get(id=post_id)
            thread = Thread.objects.get(id=thread_id)
        except Post.DoesNotExist:
            return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

        data['thread'] = thread.id
        data['post'] = post.id
        data['body'] = data.get('body')

        serializer = CreateCommentSerializer(data=data)

        if serializer.is_valid():
            serializer.save(thread=post.thread, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ThreadsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        queryset = Thread.objects.all()
        serializer = ThreadSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='list_by_username/(?P<username>[^/.]+)')
    def list_by_username(self, request, username):
        queryset = Thread.objects.get(user__username=username)
        serializer = ThreadSerializer(queryset, many=False)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='change_description')
    def changeDescription(self, request, pk=None):
        user = request.user
        description = request.data.get('description')
        try:
            thread = Thread.objects.get(user=user)
            thread.description = description
            thread.save()
            return Response("Description updated", status=status.HTTP_200_OK)
        except Thread.DoesNotExist:
            return Response("Thread not found for this user", status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='change_image')
    def changeProfileImage(self, request, pk=None):
        user = request.user
        profile_image = request.data.get('profile_image')

        try:
            thread = Thread.objects.get(user=user)
            thread.profile_image = profile_image
            thread.save()
            return Response("Profile image updated", status=status.HTTP_200_OK)
        except Thread.DoesNotExist:
            return Response("Thread not found for this user", status=status.HTTP_404_NOT_FOUND)


class PostViewSet(viewsets.ViewSet):

    permission_classes = [IsAuthenticated]

    def list(self, request):
        queryset = Post.objects.all().order_by('-created_date')
        serializer = CustomPostSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='list_by_username/(?P<username>[^/.]+)')
    def list_by_username(self, request, username):
        queryset = Post.objects.filter(
            thread__user__username=username).order_by('-created_date')
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
    permission_classes = [IsAuthenticated]

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


class CommentLikesViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='like_comment')
    def like_comment(self, request):
        user = request.user
        comment_id = request.data.get('comment_id')

        try:
            comment = Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            return Response({'message': 'Comment not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user in comment.likes.all():
            return Response({'message': 'Comment already liked.'}, status=status.HTTP_400_BAD_REQUEST)

        comment_like = CommentLike.objects.create(user=user, comment=comment)
        comment_like.save()

        return Response({'message': 'Comment liked successfully.'}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='unlike_comment')
    def unlike_comment(self, request):
        user = request.user
        data = request.data
        comment_id = data.get('comment_id')

        try:
            comment = Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            return Response({'message': 'Comment not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            comment_like = CommentLike.objects.get(user=user, comment=comment)
            comment_like.delete()
            return Response({'message': 'Comment unliked successfully.'}, status=status.HTTP_200_OK)
        except CommentLike.DoesNotExist:
            return Response({'message': 'Comment was not liked before.'}, status=status.HTTP_400_BAD_REQUEST)
