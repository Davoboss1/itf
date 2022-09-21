from rest_framework import serializers
from main.models import *

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        exclude = ["password","groups","user_permissions","last_login","is_staff","is_superuser","is_active","date_joined"]

class PendingPaymentStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["full_name", "matric_no","school"]

class PendingPaymentSerializer(serializers.ModelSerializer):
    student = PendingPaymentStudentSerializer(read_only=True)
    created_at_format = serializers.SerializerMethodField()
    key = serializers.SerializerMethodField()

    def get_key(self,obj):
        return obj.id

    def get_created_at_format(self, obj):
        return f"{obj.created_at.date().isoformat()} {obj.created_at.time().strftime('%H:%M')}"
    class Meta:
        model = PendingPayment
        exclude = ["update_at","created_at"]

class StudentLogbookSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentLogbook
        fields = '__all__'
