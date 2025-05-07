from django.urls import path
from .views import signup_view, login_view, profile_view, update_profile_view, analyze_view

urlpatterns = [
    path('signup/', signup_view, name='signup'),
    path('login/', login_view, name='login'),
    path('profile/', profile_view, name='profile'),
    path('profile/update/', update_profile_view, name='update_profile'),
    path('analyze/', analyze_view, name='analyze'),
    
]
