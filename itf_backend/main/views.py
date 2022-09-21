from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.contrib.auth import login, authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import *

# Create your views here.
def main(request):
    return JsonResponse({"Hello": "world"})

@api_view(['GET'])
def test(request):
    return Response("Success")

@api_view(['GET'])
def get_students(request):
    students = Student.objects.all()
    student_serializer = StudentSerializer(students,many=True)
    return Response(student_serializer.data)

@api_view(['GET'])
def get_admin(request):
    username = AuthUser.objects.get(token=request.query_params.get("authtoken")).username
    adminuser = AdminUser.objects.get(username=username)
    admin_serializer = AdminSerializer(adminuser)
    return Response(admin_serializer.data)


@api_view(['GET'])
def get_student(request):
    #Get student and serialize data
    matric_no = AuthUser.objects.get(token=request.query_params.get("authtoken")).username
    student = Student.objects.get(matric_no=matric_no)
    student_serializer = StudentSerializer(student)
    student_data = student_serializer.data

    #Get admin and serialize data
    admin_user = AdminUser.objects.get(school=student.school)
    admin_serializer = AdminSerializer(admin_user)
    admin_data = admin_serializer.data

    #Check status of student payment
    studentPayment = PendingPayment.objects.filter(student=student)
    #Set payment status and add additional context
    studentPaymentSerialzer = PendingPaymentSerializer(studentPayment,many=True)
    #Response context
    context = {"student": student_data,"payment":studentPaymentSerialzer.data,"admin":admin_data}

    return Response(context)

@api_view(['GET'])
def get_school(request):
    schools = AdminUser.objects.values_list("school")
    print(schools)
    return Response(schools)

@api_view(['GET'])
def get_pending_payments(request):
    username = AuthUser.objects.get(token=request.query_params.get("authtoken")).username
    adminuser = AdminUser.objects.get(username=username)
    pending_payments = PendingPayment.objects.filter(student__school=adminuser.school)
    print(pending_payments)
    pending_payment_serializer = PendingPaymentSerializer(pending_payments,many=True)
    serialized_data = pending_payment_serializer.data
    return Response(serialized_data)

@api_view(['POST'])
def confirm_pending_payments(request):
    username = AuthUser.objects.get(token=request.query_params.get("authtoken")).username
    adminuser = AdminUser.objects.get(username=username)
    data = request.data
    print(dir(data))
    for payment in data:
        paym = PendingPayment.objects.get(id=payment["id"])
        paym.confirmed = True
        paym.save()
    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def revoke_pending_payments(request):
    username = AuthUser.objects.get(token=request.query_params.get("authtoken")).username
    adminuser = AdminUser.objects.get(username=username)
    data = request.data
    print(dir(data))
    for payment in data:
        paym = PendingPayment.objects.get(id=payment["id"])
        paym.confirmed = False
        paym.save()
    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def loginView(request):
    data = request.data
    try:
        adminuser = AdminUser.objects.get(username=str(data["username"]),password=str(data["password"]))
        print(adminuser)
        authuser = AuthUser(username=adminuser.username)
        authuser.save()
        return Response({"authtoken": authuser.token},status=status.HTTP_200_OK)
    except:    
        return Response({"errorMessage": "Wrong username or password."},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def studentLoginView(request):
    try:
        data = request.data
        student = Student.objects.get(matric_no=data.get("matric-no"), password=data.get("password"))

        authuser = AuthUser(username=student.matric_no)
        authuser.save()
        return Response({"authtoken":authuser.token},status=status.HTTP_200_OK)
    except Student.DoesNotExist:
        return Response({"errorMessage" : "Wrong matric number or password."},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def studentSignupView(request):
        data = request.data
        if data.get("school") == "":
            return Response({"errorMessage": "Please Select a school."},status=status.HTTP_200_OK)
        student = StudentSerializer(data=data)
        student.is_valid()
        if student.errors:
            if student.errors.get("matric_no"):
                return Response({"errorMessage" : "Student matric number already exists." },status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({"errorMessage" : "Please, recheck your forms. Wrong data detected" },status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        student = student.save()
        authuser = AuthUser(username=student.matric_no)
        authuser.save()
        return Response({"authtoken":authuser.token},status=status.HTTP_200_OK)

@api_view(['POST'])
def setPayment(request):
    data = request.data
#    adminuser = AdminUser.objects.get(username=request.user.username)
    username = AuthUser.objects.get(token=request.query_params.get("authtoken")).username
    adminuser = AdminUser.objects.get(username=username)
    adminuser.account_name = data.get("acct-name")
    adminuser.account_bank = data.get("bank-name")
    adminuser.account_number = data.get("acct-number")
    adminuser.siwes_amount = data.get("siwes-amount")
    adminuser.it_amount = data.get("it-amount")
    adminuser.save()
    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
def logPayment(request):
    data = request.data
    print(data)
    matric_no = AuthUser.objects.get(token=request.query_params.get("authtoken")).username
    student = Student.objects.get(matric_no=matric_no)
    adminuser = AdminUser.objects.get(school=student.school)
    if data.get("payment_type") == "SW":
        PendingPayment(student=student,amount=adminuser.siwes_amount,payment_type="Siwes Payment",confirmed=False).save()
    elif data.get("payment_type") == "IT":
        PendingPayment(student=student,amount=adminuser.it_amount,payment_type="IT Payment",confirmed=False).save()
    print("Objects created")
    return Response(status=status.HTTP_200_OK)

@api_view(['POST','GET'])
def logbook(request):
    if request.method == "POST":
        data = request.data
        matric_no = AuthUser.objects.get(token=request.query_params.get("authtoken")).username
        student = Student.objects.get(matric_no=matric_no)
        data["student"] = student.pk
        print(data)
        logbook_obj = StudentLogbookSerializer(data=data)
        if logbook_obj.is_valid():
            logbook_obj.save()
            return Response({"ok": True},status=status.HTTP_200_OK)
        else:
            return Response(logbook_obj.errors,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        matric_no = AuthUser.objects.get(token=request.query_params.get("authtoken")).username
        student = Student.objects.get(matric_no=matric_no)
        logbook = StudentLogbook.objects.filter(student=student)
        logbookSerializer = StudentLogbookSerializer(logbook,many=True)
        return Response(logbookSerializer.data)

@api_view(['GET'])
def adminGetStudentLogbook(request, matric_no):
    username = AuthUser.objects.get(token=request.query_params.get("authtoken")).username
    adminuser = AdminUser.objects.get(username=username)
    student = Student.objects.get(school=adminuser.school,matric_no=matric_no)
    logbook = StudentLogbook.objects.filter(student=student)
    logbookSerializer = StudentLogbookSerializer(logbook,many=True)
    return Response({"student": {"name": student.full_name, "matric_no": student.matric_no} , "logbook" : logbookSerializer.data})

