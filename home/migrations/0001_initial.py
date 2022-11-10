# Generated by Django 4.0.1 on 2022-03-27 01:02

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='instrument',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('frequencies', django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(max_length=64), blank=True, null=True, size=None)),
                ('amplitudes', django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(max_length=64), blank=True, null=True, size=None)),
                ('attack', django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(max_length=64), blank=True, null=True, size=None)),
                ('decay', django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(max_length=64), blank=True, null=True, size=None)),
                ('sustain', django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(max_length=64), blank=True, null=True, size=None)),
                ('release', django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(max_length=64), blank=True, null=True, size=None)),
                ('generation_number', models.IntegerField(default=0)),
                ('prescore', models.FloatField(default=0)),
            ],
        ),
    ]
