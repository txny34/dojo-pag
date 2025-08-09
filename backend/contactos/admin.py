# backend/contactos/admin.py
from django.contrib import admin
from .models import Contacto

@admin.register(Contacto)
class ContactoAdmin(admin.ModelAdmin):
    list_display = ("nombre", "apellido", "email", "disciplina", "contactado", "fecha_envio")
    list_filter = ("disciplina", "contactado", "fecha_envio")
    search_fields = ("nombre", "apellido", "email")
    list_editable = ("contactado",)  # Para marcar como contactado
    ordering = ("-fecha_envio",)
    
    fieldsets = (
        ("Información Personal", {
            "fields": ("nombre", "apellido", "email", "telefono")
        }),
        ("Detalles del Contacto", {
            "fields": ("disciplina", "mensaje", "contactado")
        }),
        ("Información del Sistema", {
            "fields": ("fecha_envio",),
            "classes": ("collapse",)
        }),
    )
    readonly_fields = ("fecha_envio",)

