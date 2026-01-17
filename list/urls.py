from django.urls import path
from . import views

urlpatterns = [
    path('', views.gifts_list, name='index'),
]
