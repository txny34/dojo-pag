from rest_framework import viewsets
from .models import Contacto
from .serializers import ContactoSerializer

class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.all().order_by("-fecha_envio")  
    serializer_class = ContactoSerializer


# Create your views here.
