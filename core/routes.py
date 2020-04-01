from rest_framework import routers
from core import views

router = routers.DefaultRouter()
router.register(r'cars', views.CarViewSet, basename='cars')

urlpatterns = router.urls
