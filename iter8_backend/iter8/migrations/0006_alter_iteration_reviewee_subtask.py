# Generated by Django 5.1.1 on 2024-10-22 10:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('iter8', '0005_remove_iteration_subtask_iteration_reviewee_subtask'),
    ]

    operations = [
        migrations.AlterField(
            model_name='iteration',
            name='reviewee_subtask',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='iter8.reviewee_subtask'),
        ),
    ]
