from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser  # or whatever your custom user model is

admin.site.register(CustomUser, UserAdmin)
