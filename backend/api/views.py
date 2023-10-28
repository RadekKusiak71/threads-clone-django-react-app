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
        queryset = Post.objects.all()
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
        data = request.data
        data['thread'] = data.get('thread_id')
        data['user'] = user.id
        print(data)

        serializer = PostSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
