
# backend/contactos/models.py
from django.db import models
from django.core.validators import RegexValidator

class Contacto(models.Model):
    DISCIPLINAS_CHOICES = [
        ('boxeo', 'Boxeo'),
        ('muay-thai', 'Muay Thai'),
        ('k1', 'K-1'),
        ('jiu-jitsu', 'Jiu-Jitsu'),
    ]
    
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField()
    telefono_validator = RegexValidator(
        regex=r'^\d{8,15}$',
        message="El teléfono debe tener entre 8 y 15 dígitos"
    )
    telefono = models.CharField(
        max_length=15, 
        validators=[telefono_validator],
        blank=True, 
        null=True
    )
    disciplina = models.CharField(max_length=50, choices=DISCIPLINAS_CHOICES)
    mensaje = models.TextField(blank=True, null=True, max_length=500)
    fecha_envio = models.DateTimeField(auto_now_add=True)
    contactado = models.BooleanField(default=False)  # Para seguimiento

    def __str__(self):
        return f"{self.nombre} {self.apellido} - {self.disciplina}"

    class Meta:
        verbose_name = "Contacto"
        verbose_name_plural = "Contactos"