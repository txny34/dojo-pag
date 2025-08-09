# contactos/models.py
from django.db import models

class Contacto(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField()
    telefono = models.CharField(max_length=50, blank=True, null=True)
    disciplina = models.CharField(max_length=50)
    mensaje = models.TextField(blank=True, null=True)
    fecha_envio = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido} - {self.disciplina}"

# Create your models here.
