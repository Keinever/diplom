import json

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, JSONParser, FormParser
from django.db import transaction, IntegrityError
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404, get_list_or_404
from .models import *
from .serializers import *

class CoursesViewSet(viewsets.ModelViewSet):
    queryset = Courses.objects.all()
    serializer_class = CoursesSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def create(self, request, *args, **kwargs):
        # Для отладки
        print("Raw request data:", request.data)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # Для отладки
        print("Raw request data:", request.data)
        return super().update(request, *args, **kwargs)


class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer

class ModulesViewSet(viewsets.ModelViewSet):
    queryset = Modules.objects.all()
    serializer_class = ModuleSerializer


class SolutionsViewSet(viewsets.ModelViewSet):
    queryset = Solutions.objects.all()
    serializer_class = SolutionsSerializer


class StepsViewSet(viewsets.ModelViewSet):
    queryset = Steps.objects.all()
    serializer_class = StepSerializer
    parser_classes = [MultiPartParser, JSONParser]


class StudentsViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentsSerializer


class TeachersViewSet(viewsets.ModelViewSet):
    queryset = TeacherProfile.objects.all()
    serializer_class = TeachersSerializer


@api_view(['POST'])
@transaction.atomic
def register(request):
    try:
        with transaction.atomic():
            serializer = StudentRegistrationSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            user = CustomUser.objects.create_user(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password'],
                role='student',
            )

            StudentProfile.objects.create(
                user=user,
                first_name=serializer.validated_data['first_name'],
                last_name=serializer.validated_data['last_name'],
            )

            return Response({'status': 'success'}, status=status.HTTP_201_CREATED)

    except IntegrityError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response({'error': 'Registration failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def custom_login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(request, email=email, password=password)

    if user is None:
        return Response(
            {'detail': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.is_active:
        return Response(
            {'detail': 'Account disabled'},
            status=status.HTTP_403_FORBIDDEN
        )

    login(request, user)
    return Response({'detail': 'login success', 'data': {'role': user.role}}, status=status.HTTP_200_OK)


@api_view(['POST'])
def custom_logout(request):
    logout(request)
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response


class StudentStepAttemptView(APIView):
    def get(self, request):
        student_id = request.query_params.get('student_id')
        step_id = request.query_params.get('step_id')
        course_id = request.query_params.get('course_id')

        if (not student_id or not step_id) and (not student_id or not course_id) :
            return Response(
                {"error": "Both student_id and step_id or course_id are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if course_id:
            course = get_object_or_404(
                Courses,
                course_id=course_id
            )
            modules = get_list_or_404(Modules, course=course)
            steps = []
            attempts = []
            for module in modules:
                steps.extend(Steps.objects.filter(module=module, exercise_type="Задание"))
            for step in steps:
                attempts.extend(StudentStepAttempt.objects.filter(
                    student=student_id,
                    step=step.step_id
                ))
            serializer = StudentStepAttemptSerializer(attempts, many=True)
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)

        if step_id:
            attempt = get_object_or_404(
                StudentStepAttempt,
                student=student_id,
                step=step_id
            )

        serializer = StudentStepAttemptSerializer(attempt)
        return Response(serializer.data)

    def post(self, request):
        student_id = request.data.get('student')
        step_id = request.data.get('step')

        if not student_id or not step_id:
            return Response(
                {"error": "Both student and step are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        student = get_object_or_404(StudentProfile, pk=student_id)
        step = get_object_or_404(Steps, pk=step_id)

        attempt, created = StudentStepAttempt.objects.get_or_create(
            student=student,
            step=step,
            defaults={'attempts': 0}
        )

        attempt.attempts += 1
        attempt.save()

        serializer = StudentStepAttemptSerializer(attempt)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


class StudentCourseView(APIView):
    parser_classes = [JSONParser]
    def post(self, request):
        student_id = request.data.get('student_id')
        course_id = request.data.get('course_id')

        if not student_id or not course_id:
            return Response(
                {"error": "Both student_id and course_id are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        student = get_object_or_404(StudentProfile, pk=student_id)
        course = get_object_or_404(Courses, pk=course_id)

        course_st = StudentCourse.objects.create(
            student=student,
            course=course,
        )

        serializer = StudentCourseSerializer(course_st)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    def delete(self, request):
        student_id = request.query_params.get('student_id')
        course_id = request.query_params.get('course_id')

        if not student_id or not course_id:
            return Response(
                {"error": "Both student_id and course_id are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        student = get_object_or_404(StudentProfile, pk=student_id)
        course = get_object_or_404(Courses, pk=course_id)

        course_st = get_object_or_404(
            StudentCourse,
            student=student,
            course=course,
        )
        course_st.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

