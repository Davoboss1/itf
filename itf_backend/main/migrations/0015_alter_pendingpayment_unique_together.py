# Generated by Django 4.0.3 on 2022-08-06 10:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0014_alter_pendingpayment_student'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='pendingpayment',
            unique_together={('student', 'payment_type')},
        ),
    ]
