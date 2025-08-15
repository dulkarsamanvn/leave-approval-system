from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('employee', 'Employee'),
        ('manager', 'Manager'),
    )
    email=models.EmailField(unique=True)
    role=models.CharField(max_length=20,choices=ROLE_CHOICES, default='employee')

    USERNAME_FIELD='email'
    REQUIRED_FIELDS = []