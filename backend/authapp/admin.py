from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('id', 'username', 'email', 'age', 'gender', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'gender')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password', 'age', 'gender')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'age', 'gender', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email', 'username')
    ordering = ('id',)

admin.site.register(CustomUser, CustomUserAdmin)
