from rest_framework import routers
from core import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet, basename='users')
router.register(r'desires', views.DesireViewSet, basename='desires')
router.register(r'desire_docs', views.DesireDocViewSet, basename='desires_doc')
router.register(r'friendships', views.FriendshipViewSet, basename='friendships')
router.register(r'countries', views.CountryViewSet, basename='countries')
router.register(r'cities', views.CityViewSet, basename='cities')
router.register(r'districts', views.DistrictViewSet, basename='districts')
router.register(r'streets', views.StreetViewSet, basename='streets')
router.register(r'locations', views.LocationViewSet, basename='locations')

urlpatterns = router.urls
