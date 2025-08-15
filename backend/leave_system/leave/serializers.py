from rest_framework import serializers
from leave.models import Leave

class ApplyLeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model=Leave
        fields=['start_date','end_date','leave_type','reason']

class LeaveSerializer(serializers.ModelSerializer):
    employee_name=serializers.CharField(source='employee.username',read_only=True)
    class Meta:
        model=Leave
        fields=['id','employee_name','start_date','end_date','leave_type','reason','status']