"""esearch URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.urls import path
from django.contrib import admin
from django.views.generic import TemplateView
from core.views import LoginView, RegistrationView, LogoutView, ChangePasswordView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.routes')),
    path('api/signin/', LoginView.as_view(), name='signin'),
    path('api/signup/', RegistrationView.as_view(), name='signup'),
    path('api/signout/', LogoutView.as_view(), name='signout'),
    path('api/change_password/', ChangePasswordView.as_view(), name='change_password'),
    url(r'^', TemplateView.as_view(template_name='index.html')),
]
