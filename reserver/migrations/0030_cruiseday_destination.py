# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-08-04 14:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reserver', '0029_auto_20170804_1607'),
    ]

    operations = [
        migrations.AddField(
            model_name='cruiseday',
            name='destination',
            field=models.TextField(blank=True, default='', max_length=2000),
        ),
    ]
