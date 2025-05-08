from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Add fields like profile_pic, etc. if needed
    pass
