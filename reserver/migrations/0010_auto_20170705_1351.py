# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-07-05 11:51
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('reserver', '0009_auto_20170705_1329'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoiceinformation',
            name='cruise',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='reserver.Cruise'),
        ),
        migrations.AlterField(
            model_name='invoiceinformation',
            name='default_invoice_information_for',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='reserver.Organization'),
        ),
    ]