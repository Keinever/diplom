from django.contrib import admin
from django.urls import path
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework import routers
from university import views

router = routers.DefaultRouter()
router.register(r'courses', views.CoursesViewSet)
router.register(r'progress', views.ProgressViewSet)
router.register(r'solutions', views.SolutionsViewSet)
router.register(r'steps', views.StepsViewSet)
router.register(r'students', views.StudentsViewSet)
router.register(r'teachers', views.TeachersViewSet)
router.register(r'modules', views.ModulesViewSet)

urlpatterns = [
    path('', RedirectView.as_view(url='/api/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path(r'api/attempts', views.StudentStepAttemptView.as_view(), name='student-step-attempt'),
    path(r'api/results', views.StudentStepResultView.as_view(), name='student-step-result'),
    path(r'api/course_students', views.StudentCourseView.as_view(), name='student-course'),
    path('api-auth/register/', views.register, name='register'),
    path('api-auth/login/', views.custom_login, name='login'),
    path('api-auth/logout/', views.custom_logout, name='logout'),
    path('api/csrf_token/', views.get_csrf, name='csrf_token'),
]
