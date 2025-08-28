from rest_framework import serializers
from leave.models import Leave
from datetime import date

class ApplyLeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model=Leave
        fields=['start_date','end_date','leave_type','reason']
    
    def validate(self,data):
        start_date=data.get('start_date')
        end_date=data.get('end_date')
        today=date.today()

        if start_date < today :
            raise serializers.ValidationError({"start_date": "Start date cannot be in the past."})
        
        if end_date < start_date:
            raise serializers.ValidationError({"end_date": "End date cannot be before start date."})

        return data



class LeaveSerializer(serializers.ModelSerializer):
    employee_name=serializers.CharField(source='employee.username',read_only=True)
    employee_id=serializers.IntegerField(source='employee.id',read_only=True)
    class Meta:
        model=Leave
        fields=['id','employee_name','start_date','end_date','leave_type','reason','status','employee_id']