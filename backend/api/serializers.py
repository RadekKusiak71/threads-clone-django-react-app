from rest_framework import serializers
from .models import Thread, Post, Comment, CommentLike, PostLike


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = '__all__'


class CustomPostSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source='thread.user.username')
    profile_image = serializers.ImageField(source='thread.profile_image')
    likes_count = serializers.IntegerField(source='calculate_likes_count')
    comments_count = serializers.IntegerField(
        source='calculate_comments_count')

    class Meta:
        model = Post
        fields = '__all__'
