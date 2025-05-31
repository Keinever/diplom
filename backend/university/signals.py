from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.shortcuts import get_list_or_404
from .models import *


@receiver(post_save, sender=StudentCourse)
def post_save_step(sender, instance: StudentCourse, **kwargs):
    modules = get_list_or_404(Modules, course=instance.course)
    steps = []
    for module in modules:
        steps.extend(Steps.objects.filter(module=module, exercise_type="Задание"))
    for step in steps:
        StudentStepAttempt.objects.create(
            student=instance.student,
            step=step
        )
