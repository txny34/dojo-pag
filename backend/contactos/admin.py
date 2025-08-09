from django.contrib import admin
from .models import Contacto

@admin.register(Contacto)
class ContactoAdmin(admin.ModelAdmin):
    list_display = ("nombre", "apellido", "email", "telefono", "disciplina", "fecha_envio")
    search_fields = ("nombre", "apellido", "email", "disciplina")


# Register your models here.
