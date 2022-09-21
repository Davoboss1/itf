# Generated by Django 4.0.3 on 2022-07-22 11:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_alter_pendingpayment_confirmed_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='has_paid',
        ),
        migrations.AddField(
            model_name='student',
            name='image',
            field=models.ImageField(default='images/person-circle.svg', upload_to='images/'),
        ),
    ]