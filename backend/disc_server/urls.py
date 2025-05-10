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

urlpatterns = [
    path('', RedirectView.as_view(url='/api/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
