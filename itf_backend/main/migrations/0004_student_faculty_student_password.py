# Generated by Django 4.0.3 on 2022-07-19 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_student_level'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='faculty',
            field=models.CharField(default='None', max_length=30),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='student',
            name='password',
            field=models.CharField(default='Davo2001', max_length=20),
            preserve_default=False,
        ),
    ]