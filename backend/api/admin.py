from django.contrib import admin
from .models import Thread, Post, Comment, CommentLike, PostLike

admin.site.register(Thread)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(CommentLike)
admin.site.register(PostLike)
