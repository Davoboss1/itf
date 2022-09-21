from django.contrib import admin
from main.models import *

class AdminUserModelAdmin(admin.ModelAdmin):
    fields = ("username","password","email","first_name","last_name","school","account_name","account_number","account_bank","siwes_amount", "it_amount")

# Register your models here.
admin.site.register(AdminUser,AdminUserModelAdmin)
admin.site.register(Student)
admin.site.register(PendingPayment)
admin.site.register(AuthUser)
admin.site.register(StudentLogbook)
