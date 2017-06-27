# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-27 13:13
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cruise', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CruiseDay',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_long_day', models.BooleanField()),
                ('description', models.CharField(max_length=471)),
                ('breakfast_count', models.PositiveSmallIntegerField()),
                ('lunch_count', models.PositiveSmallIntegerField()),
                ('dinner_count', models.PositiveSmallIntegerField()),
                ('overnight_count', models.PositiveSmallIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='GeographicalArea',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.CharField(max_length=200)),
                ('latitude', models.DecimalField(decimal_places=10, max_digits=13)),
                ('longitude', models.DecimalField(decimal_places=10, max_digits=13)),
                ('cruise_day', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='cruise.CruiseDay')),
            ],
        ),
        migrations.CreateModel(
            name='InvoiceInformation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('business_reg_num', models.PositiveIntegerField()),
                ('invoice_address', models.CharField(max_length=200)),
                ('accounting_place', models.CharField(max_length=200)),
                ('project_number', models.CharField(max_length=200)),
                ('invoice_mark', models.CharField(max_length=200)),
                ('contact_name', models.CharField(max_length=200)),
                ('contact_email', models.EmailField(max_length=254)),
            ],
        ),
        migrations.CreateModel(
            name='ListPrice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('invoice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cruise.InvoiceInformation')),
            ],
        ),
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('is_NTNU', models.BooleanField()),
                ('default_invoice_information', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='cruise.InvoiceInformation')),
            ],
        ),
        migrations.CreateModel(
            name='Participant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
                ('name', models.CharField(max_length=200)),
                ('nationality', models.CharField(max_length=50)),
                ('date_of_birth', models.DateField()),
                ('identity_document_types', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Season',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('long_education_price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('long_research_price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('long_boa_price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('long_external_price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('short_education_price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('short_research_price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('short_boa_price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('short_external_price', models.DecimalField(decimal_places=2, max_digits=12)),
            ],
        ),
        migrations.CreateModel(
            name='TimeInterval',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('event', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='cruise.Event')),
            ],
        ),
        migrations.CreateModel(
            name='UserData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_crew', models.BooleanField()),
                ('role', models.CharField(max_length=50)),
                ('phone_number', models.CharField(max_length=50)),
                ('nationality', models.CharField(max_length=50)),
                ('date_of_birth', models.DateField()),
                ('identity_document_types', models.CharField(max_length=200)),
                ('organization', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='cruise.Organization')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='cruise',
            name='cruise_owner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='cruise',
            name='last_edit_date',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='cruise',
            name='meals_on_board',
            field=models.CharField(max_length=471),
        ),
        migrations.AlterField(
            model_name='cruise',
            name='submit_date',
            field=models.DateTimeField(),
        ),
        migrations.AddField(
            model_name='season',
            name='external_order_interval',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='external_order_interval', to='cruise.TimeInterval'),
        ),
        migrations.AddField(
            model_name='season',
            name='internal_order_interval',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='internal_order_interval', to='cruise.TimeInterval'),
        ),
        migrations.AddField(
            model_name='season',
            name='season_interval',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='season_interval', to='cruise.TimeInterval'),
        ),
        migrations.AddField(
            model_name='participant',
            name='cruise',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cruise.Cruise'),
        ),
        migrations.AddField(
            model_name='cruiseday',
            name='cruise',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='cruise.Cruise'),
        ),
        migrations.AddField(
            model_name='cruiseday',
            name='event',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='cruise.Event'),
        ),
        migrations.AddField(
            model_name='cruise',
            name='organization',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='cruise.Organization'),
        ),
        migrations.AddField(
            model_name='cruise',
            name='season',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='cruise.Season'),
        ),
    ]
