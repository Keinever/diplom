from django.contrib import admin
from django.urls import path
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework import routers
from university import views

router = routers.DefaultRouter()
router.register(r'topics', views.CourseTopicViewSet)
router.register(r'subtopics', views.SubtopicViewSet)
router.register(r'labs', views.LabViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'assignments', views.AssignmentViewSet)
router.register(r'attempts', views.AttemptViewSet)

urlpatterns = [
    path('', RedirectView.as_view(url='/api/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
