from django.shortcuts import render
from rest_framework.views import APIView
from accounts.models import User
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken,TokenError
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated


class LoginPageView(APIView):
    def post(self,request):
        email=request.data.get('email')
        password=request.data.get('password')

        try:
            user=User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail':'Invalid Credentials'},status=status.HTTP_401_UNAUTHORIZED)
        
        user=authenticate(username=email,password=password)
        if user is None:
            return Response({'error':'Invalid Credentials'},status=status.HTTP_401_UNAUTHORIZED)
        refresh=RefreshToken.for_user(user)
        access_token=str(refresh.access_token)
        refresh_token=str(refresh)

        response=JsonResponse({'message':'Login Successful','role':user.role})
        response.set_cookie(
            key='access_token',
            value=access_token,
            max_age= 60 * 5,
            secure=False,
            httponly= True,
            samesite='Lax'
        )

        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            max_age= 60 * 60 * 24 * 7,
            secure=False,
            httponly= True,
            samesite='Lax'
        )

        return response


class LogoutView(APIView):
    def post(self,request):
        response=JsonResponse({'message':'Logout Successful'})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response


class RefreshTokenView(APIView):
    def post(self,request):
        refresh_token=request.COOKIES.get('refresh_token')
        if refresh_token is None:
            return Response({'detail':'Refresh Token Missing'},status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh=RefreshToken(refresh_token)
            access_token=str(refresh.access_token)
            response=JsonResponse({'message':'Token Refreshed'})
            response.set_cookie(
                key='access_token',
                value=access_token,
                max_age= 60 * 5,
                secure=True,
                httponly= True,
                samesite='None'
            )
            return response
        except TokenError:
            return Response({'detail':'Invalid refresh token'},status=status.HTTP_403_FORBIDDEN)


