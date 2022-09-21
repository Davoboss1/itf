from random import choice
from string import ascii_letters,digits
from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class AdminUser(User):
    school = models.CharField(max_length=100, unique=True, null=True, blank=True)
    account_name = models.CharField(max_length=100, null=True, blank=True)
    account_number = models.CharField(max_length=10, null=True, blank=True)
    account_bank = models.CharField(max_length=50, null=True, blank=True)
    siwes_amount = models.CharField(max_length=50, null=True, blank=True)
    it_amount = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"{self.username} : {self.school}"

class AuthUser(models.Model):
    username = models.CharField(max_length=50, unique=True)
    token = models.CharField(max_length=16, unique=True)

    def save(self, *args, **kwargs):
        while True:
            self.token = ''.join(choice(ascii_letters + digits) for i in range(16))
            if AuthUser.objects.filter(token=self.token).exists():
                continue
            else:
                break
        try:
            super(AuthUser, self).save(*args, **kwargs)
        except:
            AuthUser.objects.filter(username=self.username).update(token=self.token)

class Student(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    phone_no = models.CharField(max_length=30)
    dob = models.CharField(max_length=20)
    school = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    matric_no = models.CharField(max_length=20, unique=True)
    program = models.CharField(max_length=30)
    level = models.CharField(max_length=20)
    faculty = models.CharField(max_length=30)
    password = models.CharField(max_length=20)
    image = models.ImageField(upload_to="images/",default="images/person-circle.svg")

    def __str__(self):
        return f"{self.full_name} : {self.matric_no}"

class PendingPayment(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE)
    confirmed = models.BooleanField(default=False)
    payment_type = models.CharField(max_length=25)
    amount = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    class Meta:
        #unique_together = ['student', 'payment_type']
        pass

    def __str__(self):
        return f"{self.student.full_name} paid {self.amount} Time: {self.created_at.date().isoformat()}, Confirmed: {self.confirmed}"

class StudentLogbook(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    details = models.CharField(max_length=500)
    supervisor = models.CharField(max_length=100)
    date = models.DateField()

    def __str__(self):
        return self.student.full_name + ": " + self.title

