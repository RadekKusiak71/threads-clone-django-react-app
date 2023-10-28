from django.db import models
from django.contrib.auth.models import User
import os
from django.core.validators import FileExtensionValidator


def user_directory_path(instance, filename):
    return os.path.join('media', 'users', instance.user.username, filename)

def user_directory_path_post(instance, filename):
    return os.path.join('media', 'users', instance.thread.user.username, filename)


class Thread(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(
        upload_to=user_directory_path, null=True, blank=True)
    description = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f'@{self.user.username}'


class Post(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    body = models.TextField(max_length=280)
    created_date = models.DateTimeField(auto_now_add=True)
    attachment = models.FileField(upload_to=user_directory_path_post, null=True, blank=True, validators=[
                                  FileExtensionValidator(allowed_extensions=['mp4', 'mp3', 'png', 'jpeg', 'jpg'])])
    likes = models.ManyToManyField(
        User, related_name="liked_posts", through='PostLike')

    def calculate_likes_count(self):
        return self.likes.count()

    def calculate_comments_count(self):
        comments = Comment.objects.filter(post=self)
        return comments.count()


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    body = models.TextField(max_length=280)
    created_date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(
        User, related_name="liked_comments", through='CommentLike')


class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)


class CommentLike(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)
