# Generated by Django 4.0.3 on 2022-07-19 14:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_student_faculty_student_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='has_paid',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='PendingPayment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('confirmed', models.BooleanField()),
                ('amount', models.CharField(max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.student')),
            ],
        ),
    ]
