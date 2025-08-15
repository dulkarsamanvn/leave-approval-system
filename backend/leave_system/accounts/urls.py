from django.urls import path
from accounts.views import LoginPageView,LogoutView,RefreshTokenView

urlpatterns = [
  path('login/',LoginPageView.as_view(),name='login'),
  path('logout/',LogoutView.as_view(),name='logout'),
  path('refresh-token/',RefreshTokenView.as_view(),name='refresh-token'),
]
