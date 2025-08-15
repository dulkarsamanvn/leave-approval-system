from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.exceptions import TokenError

User=get_user_model()

class JWTCookieAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token=request.COOKIES.get('access_token')
        if raw_token is None:
            return None
        try:
            validated_token=self.get_validated_token(raw_token)
            user=self.get_user(validated_token)
            return (user,validated_token)
        except TokenError:
            return None
