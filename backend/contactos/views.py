from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Contacto
from .serializers import ContactoSerializer
from .utils.recaptcha import verify_recaptcha  # ← ruta relativa dentro de la app

class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.all().order_by("-fecha_envio")
    serializer_class = ContactoSerializer

    def create(self, request, *args, **kwargs):
        # 1) Leer token del body (JSON del front)
        token = request.data.get("recaptchaToken") or request.data.get("recaptcha_token")

        # 2) Verificar reCAPTCHA
        remote_ip = request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip() or request.META.get("REMOTE_ADDR")
        if not verify_recaptcha(token, remote_ip):
            return Response({"detail": "Captcha inválido"}, status=status.HTTP_400_BAD_REQUEST)

        # 3) Continuar con la creación normal
        return super().create(request, *args, **kwargs)

