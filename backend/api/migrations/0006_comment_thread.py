# Generated by Django 4.2.6 on 2023-11-06 16:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_post_attachment'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='thread',
            field=models.ForeignKey(default=False, on_delete=django.db.models.deletion.CASCADE, to='api.thread'),
            preserve_default=False,
        ),
    ]
