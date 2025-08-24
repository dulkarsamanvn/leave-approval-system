from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from leave.serializers import ApplyLeaveSerializer,LeaveSerializer
from rest_framework.response import Response
from rest_framework import status
from leave.models import Leave
from django.db.models import Count,Sum,ExpressionWrapper,F,fields
from django.core.paginator import Paginator
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
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 5))
        if user.role=='manager':
            leaves=Leave.objects.all().order_by('-applied_on')
        if user.role=='employee':
            leaves=Leave.objects.filter(employee=user).order_by('-applied_on')
        paginator=Paginator(leaves,page_size)
        page_obj=paginator.get_page(page)
        serializer=LeaveSerializer(page_obj.object_list,many=True)
        return Response({
            'role':user.role,
            'leaves':serializer.data,
            'count':paginator.count
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



class EmployeeLeaveSummaryView(APIView):
    permission_classes =[IsAuthenticated]

    def get(self,request,emp_id):
        leaves=Leave.objects.filter(employee__id=emp_id,status='approved')
        leaves_with_days=leaves.annotate(
            days=ExpressionWrapper(
                F('end_date')-F('start_date'),
                output_field=fields.DurationField()
            )
        )
        print(leaves_with_days)
        total_days=sum([(leave.days.days +1) for leave in leaves_with_days])
        print(total_days)
        summary=[]
        for leave_type in leaves.values_list('leave_type',flat=True).distinct():
            lt_leaves=leaves_with_days.filter(leave_type=leave_type)
            days_taken=sum([(leave.days.days +1) for leave in lt_leaves])
            summary.append({
                'leave_type': leave_type,
                'days_taken': days_taken
            })
        return Response({
            'total': total_days,
            'summary': summary
        })
