from rest_framework import serializers
from .models import *


class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Steps
        fields = '__all__'
        extra_kwargs = {'module': {'required': False}}


class ModuleSerializer(serializers.ModelSerializer):
    steps = StepSerializer(many=True)

    class Meta:
        model = Modules
        fields = '__all__'
        extra_kwargs = {
            'course': {'required': False}
        }


class CoursesSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True)

    class Meta:
        model = Courses
        fields = '__all__'

    def create(self, validated_data):
        modules_data = validated_data.pop('modules')
        course = Courses.objects.create(**validated_data)

        for module_data in modules_data:
            steps_data = module_data.pop('steps')
            module = Modules.objects.create(course=course, **module_data)

            for step_data in steps_data:
                Steps.objects.create(module=module, **step_data)

        return course

    # def update(self, instance, validated_data):
    #     modules_data = validated_data.pop('modules')
    #
    #     instance.title = validated_data.get('title', instance.title)
    #     instance.description = validated_data.get('description', instance.description)
    #     instance.save()
    #
    #     instance.modules.all().delete()
    #
    #     for module_data in modules_data:
    #         steps_data = module_data.pop('steps')
    #         module = Modules.objects.create(course=instance, **module_data)
    #
    #         for step_data in steps_data:
    #             Steps.objects.create(module=module, **step_data)
    #
    #     return instance

class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = '__all__'

class SolutionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solutions
        fields = '__all__'

class StepsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Steps
        fields = '__all__'

class StudentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = '__all__'

class TeachersSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = '__all__'

class StudentRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}
