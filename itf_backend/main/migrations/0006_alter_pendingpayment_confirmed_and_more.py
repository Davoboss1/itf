# Generated by Django 4.0.3 on 2022-07-21 14:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_student_has_paid_pendingpayment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pendingpayment',
            name='confirmed',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='pendingpayment',
            name='student',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='main.student'),
        ),
        migrations.AlterField(
            model_name='student',
            name='matric_no',
            field=models.CharField(max_length=20, unique=True),
        ),
    ]
