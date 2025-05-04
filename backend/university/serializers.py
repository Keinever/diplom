from rest_framework import serializers
from .models import *

class CourseTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseTopic
        fields = '__all__'

class SubtopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtopic
        fields = '__all__'

class LabSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lab
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

class AttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attempt
        fields = '__all__'