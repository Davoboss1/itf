# Generated by Django 4.0.3 on 2022-07-18 13:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_alter_adminuser_account_bank_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='level',
            field=models.CharField(default='ND2', max_length=20),
            preserve_default=False,
        ),
    ]
