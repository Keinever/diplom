from collections import defaultdict

from rest_framework import serializers
from .models import *
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from django.core.files.base import ContentFile


class TeachersSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = '__all__'



class StudentStepAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentStepAttempt
        fields = ['attempts', 'student', 'step']


class StepSerializer(serializers.ModelSerializer):
    step_file = serializers.FileField(
        required=False,
        allow_null=True,
        write_only=True,
        validators=[FileExtensionValidator(allowed_extensions=['mov', 'avi', 'mp4', 'webm', 'mkv', 'pdf'])]
    )

    class Meta:
        model = Steps
        fields = '__all__'
        extra_kwargs = {
            'step_id': {'read_only': True},
            'module': {'read_only': True}
        }

    def create(self, validated_data):
        step_file = validated_data.pop('step_file', None)
        instance = super().create(validated_data)
        if step_file:
            instance.step_file.save(step_file.name, step_file)
        return instance

    attempts = StudentStepAttemptSerializer(
        source='step_attempts',
        many=True,
        read_only=True
    )


class ModuleSerializer(serializers.ModelSerializer):
    steps = StepSerializer(many=True, required=False)

    class Meta:
        model = Modules
        fields = '__all__'
        extra_kwargs = {
            'course': {'required': False},
            'module_id': {'read_only': True}
        }

    def to_internal_value(self, data):
        """
        Преобразует данные из плоского QueryDict в структурированный формат
        """
        result = {}

        def set_nested(target, keys, value):
            current = target
            for i, key in enumerate(keys):
                is_last = i == len(keys) - 1
                next_key = keys[i+1] if i+1 < len(keys) else None

                # Обработка списков
                if next_key and next_key.isdigit():
                    # Создаем список при необходимости
                    if key not in current:
                        current[key] = []
                    container = current[key]

                    index = int(next_key)
                    # Расширяем список до нужного размера
                    while len(container) <= index:
                        container.append({})

                    # Переходим к элементу списка
                    current = container[index]
                    i += 1  # Пропускаем обработанный индекс
                else:
                    # Обработка словарей
                    if key not in current:
                        current[key] = {} if not is_last else value
                    current = current[key]

            # Устанавливаем значение для последнего ключа
            if isinstance(current, dict) and not is_last:
                current[keys[-1]] = value

        for key, value in data.items():
            if isinstance(value, list):
                value = value[0]

            path = [p for p in key.replace(']', '').split('[') if p]
            set_nested(result, path, value)
        print(result)
        result["steps"] = [v for step in  result.get("steps", []) for k,v in step.items()]
        print(result)
        return super().to_internal_value(result)


class CoursesSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True)

    class Meta:
        model = Courses
        fields = '__all__'
        extra_kwargs = {
            'course_id': {'read_only': True},
            "teacher": {"read_only": True},
            "students": {"read_only": True},
        }

    def create(self, validated_data):
        modules_data = validated_data.pop('modules')
        user = self.context["request"].user
        try:
            teacher = TeacherProfile.objects.get(user=user)
        except ObjectDoesNotExist:
            raise Http404

        course = Courses.objects.create(teacher=teacher, **validated_data)

        for module_data in modules_data:
            steps_data = module_data.pop('steps', [])
            module = Modules.objects.create(course=course, **module_data)

            for step_data in steps_data:
                step_file = step_data.pop('step_file', None)
                step = Steps.objects.create(module=module, **step_data)
                if step_file:
                    step.step_file.save(
                        step_file.name,
                        ContentFile(step_file.read()),
                        save=True
                    )

        return course


class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = '__all__'


class SolutionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solutions
        fields = '__all__'


class StudentsSerializer(serializers.ModelSerializer):
    attempts = StudentStepAttemptSerializer(
        source='student_attempts',
        many=True,
        read_only=True
    )
    class Meta:
        model = StudentProfile
        fields = '__all__'



class StudentRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}
