# backend/contactos/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Contacto


def marcar_contactado(modeladmin, request, queryset):
    queryset.update(contactado=True)
    modeladmin.message_user(request, f"{queryset.count()} contacto(s) marcado(s) como contactado.")
marcar_contactado.short_description = "Marcar como contactado"

def marcar_no_contactado(modeladmin, request, queryset):
    queryset.update(contactado=False)
    modeladmin.message_user(request, f"{queryset.count()} contacto(s) marcado(s) como pendiente.")
marcar_no_contactado.short_description = "Marcar como pendiente"


@admin.register(Contacto)
class ContactoAdmin(admin.ModelAdmin):
    list_display = (
        "nombre", "apellido", "email", "telefono",
        "disciplina_badge", "estado_badge", "fecha_envio",
    )
    list_display_links = ("nombre", "apellido")
    list_filter = ("disciplina", "contactado", "fecha_envio")
    search_fields = ("nombre", "apellido", "email", "telefono")
    ordering = ("-fecha_envio",)
    date_hierarchy = "fecha_envio"
    list_per_page = 25
    actions = [marcar_contactado, marcar_no_contactado]

    fieldsets = (
        ("Información Personal", {
            "fields": ("nombre", "apellido", "email", "telefono"),
        }),
        ("Detalles del Contacto", {
            "fields": ("disciplina", "mensaje", "contactado"),
        }),
        ("Sistema", {
            "fields": ("fecha_envio",),
            "classes": ("collapse",),
        }),
    )
    readonly_fields = ("fecha_envio",)

    # --- Columnas con formato visual ---

    DISCIPLINA_COLORS = {
        "boxeo":      ("#dc2626", "#fee2e2"),   # rojo
        "muay-thai":  ("#d97706", "#fef3c7"),   # naranja
        "k1":         ("#7c3aed", "#ede9fe"),   # violeta
        "jiu-jitsu":  ("#0891b2", "#e0f2fe"),   # azul
    }

    @admin.display(description="Disciplina", ordering="disciplina")
    def disciplina_badge(self, obj):
        color, bg = self.DISCIPLINA_COLORS.get(obj.disciplina, ("#374151", "#f3f4f6"))
        label = obj.get_disciplina_display()
        return format_html(
            '<span style="'
            "background:{bg};color:{color};padding:2px 10px;"
            "border-radius:12px;font-size:0.8em;font-weight:600;"
            '">{label}</span>',
            bg=bg, color=color, label=label,
        )

    @admin.display(description="Estado", boolean=False, ordering="contactado")
    def estado_badge(self, obj):
        if obj.contactado:
            return format_html(
                '<span style="background:#dcfce7;color:#166534;padding:2px 10px;'
                'border-radius:12px;font-size:0.8em;font-weight:600;">Contactado</span>'
            )
        return format_html(
            '<span style="background:#fee2e2;color:#991b1b;padding:2px 10px;'
            'border-radius:12px;font-size:0.8em;font-weight:600;">Pendiente</span>'
        )
