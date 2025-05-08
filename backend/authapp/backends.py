from django.contrib.auth.models import User
from django.contrib.auth.backends import ModelBackend

class UsernameOrEmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        # Check if the input is an email or username
        try:
            if '@' in username:  # If it's an email
                user = User.objects.get(email=username)
            else:  # Else, it's a username
                user = User.objects.get(username=username)
        except User.DoesNotExist:
            return None
        
        # Validate the password
        if user.check_password(password):
            return user
        return None
