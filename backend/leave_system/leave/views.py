from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from leave.serializers import ApplyLeaveSerializer,LeaveSerializer
from rest_framework.response import Response
from rest_framework import status
from leave.models import Leave
# Create your views here.

class ApplyLeaveRequestView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        print('request reached ')
        serializer=ApplyLeaveSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(employee=request.user)
            return Response({'message':'Leave Applied Successfully'},status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class GetLeavesView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        user=request.user
        if user.role=='manager':
            leaves=Leave.objects.all()
        if user.role=='employee':
            leaves=Leave.objects.filter(employee=user)
        serializer=LeaveSerializer(leaves,many=True)
        return Response({
            'role':user.role,
            'leaves':serializer.data
        })
        

class UpdateStatusView(APIView):
    permission_classes =[IsAuthenticated]

    def patch(self,request,id):
        user=request.user
        leave_status=request.data.get('status')
        if user.role != 'manager':
            return Response({'detail':'not authorized'},status=status.HTTP_401_UNAUTHORIZED)
        try:
            leave=Leave.objects.get(id=id)
        except Leave.DoesNotExist:
            return Response({'detail':'Leave not found'},status=status.HTTP_404_NOT_FOUND)
        leave.status=leave_status
        leave.save()
        return Response({'message':'Leave updated successfully'})
