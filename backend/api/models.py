from django.db import models
from django.contrib.auth.models import User
import os
from django.core.validators import FileExtensionValidator


def user_directory_path(instance, filename):
    return os.path.join('media', 'users', instance.user.username, filename)


class Thread(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to=user_directory_path)
    description = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f'@{self.user.username}'


class Post(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    body = models.TextField(max_length=280)
    created_date = models.DateTimeField(auto_now_add=True)
    attachment = models.FileField(upload_to=user_directory_path, null=True, validators=[
                                  FileExtensionValidator(allowed_extensions=['mp4', 'mp3', 'png', 'jpge', 'jpg'])])
    likes = models.ManyToManyField(
        User, related_name="liked_posts", through='PostLike')
    unlikes = models.ManyToManyField(
        User, related_name="unliked_posts", through='PostUnlike')


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    body = models.TextField(max_length=280)
    created_date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(
        User, related_name="liked_comments", through='CommentLike')
    unlikes = models.ManyToManyField(
        User, related_name="unliked_comments", through='CommentUnlike')


class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)


class PostUnlike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)


class CommentLike(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)


class CommentUnlike(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)
