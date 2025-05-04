from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import *
from .serializers import *

class CourseTopicViewSet(viewsets.ModelViewSet):
    queryset = CourseTopic.objects.all()
    serializer_class = CourseTopicSerializer
    filter_fields = ['topic_name']

class SubtopicViewSet(viewsets.ModelViewSet):
    queryset = Subtopic.objects.all()
    serializer_class = SubtopicSerializer
    filter_fields = ['topic', 'subtopic_name']

class LabViewSet(viewsets.ModelViewSet):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer
    filter_fields = ['subtopic', 'lab_name', 'have_attestation', 'have_training']

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_fields = ['role', 'group_name', 'isu_id']

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    filter_fields = ['lab', 'is_exam', 'academic_year', 'semester']

class AttemptViewSet(viewsets.ModelViewSet):
    queryset = Attempt.objects.all()
    serializer_class = AttemptSerializer
    filter_fields = ['assignment', 'user', 'is_passed']