"""itf_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
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
from django.contrib import admin
from django.urls import path
from main.views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", main),
    path("test/", test),
    path("students/", get_students),
    path("student/", get_student),
    path("get_admin/", get_admin),
    path("get_school/", get_school),
    path("get_pending_payments/", get_pending_payments),
    path("login/", loginView),
    path("student-login/", studentLoginView),
    path("student-register/", studentSignupView),
    path("set-payment/", setPayment),
    path("log-payment/", logPayment),
    path("confirm-payment/", confirm_pending_payments),
    path("revoke-payment/", revoke_pending_payments),
    path("student-logbook/", logbook),
    path("get-student-logbook/<matric_no>/", adminGetStudentLogbook),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
