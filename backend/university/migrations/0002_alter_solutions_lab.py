# Generated by Django 5.2.1 on 2025-05-26 18:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('university', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='solutions',
            name='lab',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='university.steps'),
        ),
    ]
