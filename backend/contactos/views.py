from rest_framework import viewsets
from rest_framework.throttling import AnonRateThrottle
from .models import Contacto
from .serializers import ContactoSerializer


class ContactoCreateThrottle(AnonRateThrottle):
    scope = "contacto_create"


class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.all().order_by("-fecha_envio")
    serializer_class = ContactoSerializer

    def get_throttles(self):
        if self.action == "create":
            return [ContactoCreateThrottle()]
        return []

