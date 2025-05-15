from rest_framework import serializers
from .models import *


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
        validators=[FileExtensionValidator(allowed_extensions=['mov', 'avi', 'mp4', 'webm', 'mkv', 'pdf'])]
    )

    class Meta:
        model = Steps
        fields = '__all__'
        extra_kwargs = {
            'module': {'required': False},
        }

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


class CoursesSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True)
    teacher = TeachersSerializer(read_only=True)

    class Meta:
        model = Courses
        fields = '__all__'
        extra_kwargs = {
            'course_id': {'read_only': True}
        }

    def create(self, validated_data):
        user = self.context["request"].user
        try:
            teacher = TeacherProfile.objects.get(user=user)
        except TeacherProfile.DoesNotExist:
            raise serializers.ValidationError("User is not a teacher")

        modules_data = validated_data.pop('modules', [])
        course = Courses.objects.create(teacher=teacher, **validated_data)

        for module_data in modules_data:
            steps_data = module_data.pop('steps', [])
            module = Modules.objects.create(course=course, **module_data)

            for step_data in steps_data:

                step_file = step_data.pop('step_file', None)
                step = Steps.objects.create(module=module, **step_data)
                if step_file:
                    step.step_file = step_file
                    step.save()

        return course

    def update(self, instance, validated_data):
        modules_data = validated_data.pop('modules', [])


        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.save()


        for module in instance.modules.all():
            for step in module.steps.all():
                if step.step_file:
                    step.step_file.delete()
            module.delete()


        for module_data in modules_data:
            steps_data = module_data.pop('steps', [])
            module = Modules.objects.create(course=instance, **module_data)

            for step_data in steps_data:
                step_file = step_data.pop('step_file', None)
                step = Steps.objects.create(module=module, **step_data)
                if step_file:
                    step.step_file = step_file
                    step.save()

        return instance


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
