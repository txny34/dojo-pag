from unittest.mock import patch
from django.core.cache import cache
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Contacto

PAYLOAD_VALIDO = {
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@test.com",
    "telefono": "099123456",
    "disciplina": "boxeo",
    "mensaje": "Quiero inscribirme",
    "recaptchaToken": "token-falso",
}


class ContactoListTest(APITestCase):
    def setUp(self):
        Contacto.objects.create(
            nombre="Ana", apellido="García", email="ana@test.com",
            disciplina="muay-thai",
        )
        Contacto.objects.create(
            nombre="Luis", apellido="López", email="luis@test.com",
            disciplina="jiu-jitsu",
        )

    def test_lista_todos_los_contactos(self):
        url = reverse("contacto-list")
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(r.data), 2)

    def test_lista_ordena_por_fecha_desc(self):
        url = reverse("contacto-list")
        r = self.client.get(url)
        # El más reciente primero (Luis fue creado después)
        self.assertEqual(r.data[0]["nombre"], "Luis")


class ContactoCreateTest(APITestCase):
    """Tests de POST /contactos/ — reCAPTCHA mockeado a nivel de clase."""

    def setUp(self):
        cache.clear()  # resetea el throttle entre tests
        self.patcher = patch(
            "contactos.views.verify_recaptcha",
            return_value=(True, {"success": True}),
        )
        self.patcher.start()

    def tearDown(self):
        self.patcher.stop()

    def test_crea_contacto_valido(self):
        url = reverse("contacto-list")
        r = self.client.post(url, PAYLOAD_VALIDO, format="json")
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Contacto.objects.count(), 1)
        c = Contacto.objects.first()
        self.assertEqual(c.nombre, "Juan")
        self.assertFalse(c.contactado)
        self.assertEqual(c.notas, "")

    def test_campos_opcionales_aceptados(self):
        payload = {**PAYLOAD_VALIDO, "telefono": "", "mensaje": ""}
        url = reverse("contacto-list")
        r = self.client.post(url, payload, format="json")
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)

    def test_rechaza_email_invalido(self):
        payload = {**PAYLOAD_VALIDO, "email": "no-es-email"}
        url = reverse("contacto-list")
        r = self.client.post(url, payload, format="json")
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_rechaza_disciplina_invalida(self):
        payload = {**PAYLOAD_VALIDO, "disciplina": "yoga"}
        url = reverse("contacto-list")
        r = self.client.post(url, payload, format="json")
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_rechaza_telefono_muy_corto(self):
        payload = {**PAYLOAD_VALIDO, "telefono": "123"}
        url = reverse("contacto-list")
        r = self.client.post(url, payload, format="json")
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_rechaza_nombre_ausente(self):
        payload = {k: v for k, v in PAYLOAD_VALIDO.items() if k != "nombre"}
        url = reverse("contacto-list")
        r = self.client.post(url, payload, format="json")
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)


class ContactoRecaptchaTest(APITestCase):
    """Verifica que un token inválido bloquea la creación."""

    def setUp(self):
        cache.clear()

    def test_rechaza_sin_recaptcha_valido(self):
        with patch(
            "contactos.views.verify_recaptcha",
            return_value=(False, {"error-codes": ["invalid-input-response"]}),
        ):
            url = reverse("contacto-list")
            r = self.client.post(url, PAYLOAD_VALIDO, format="json")
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", r.data)
        self.assertEqual(Contacto.objects.count(), 0)


class ContactoPatchTest(APITestCase):
    def setUp(self):
        self.contacto = Contacto.objects.create(
            nombre="Pedro", apellido="Ruiz", email="pedro@test.com",
            disciplina="k1",
        )
        self.url = reverse("contacto-detail", args=[self.contacto.pk])

    def test_marcar_contactado(self):
        r = self.client.patch(self.url, {"contactado": True}, format="json")
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.contacto.refresh_from_db()
        self.assertTrue(self.contacto.contactado)

    def test_agregar_notas(self):
        r = self.client.patch(self.url, {"notas": "Llamado el lunes"}, format="json")
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.contacto.refresh_from_db()
        self.assertEqual(self.contacto.notas, "Llamado el lunes")

    def test_patch_multiple_campos(self):
        r = self.client.patch(self.url, {"contactado": True, "notas": "OK"}, format="json")
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.contacto.refresh_from_db()
        self.assertTrue(self.contacto.contactado)
        self.assertEqual(self.contacto.notas, "OK")

    def test_patch_inexistente_retorna_404(self):
        url = reverse("contacto-detail", args=[9999])
        r = self.client.patch(url, {"contactado": True}, format="json")
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)


class ContactoDeleteTest(APITestCase):
    def setUp(self):
        self.contacto = Contacto.objects.create(
            nombre="María", apellido="Sosa", email="maria@test.com",
            disciplina="jiu-jitsu",
        )
        self.url = reverse("contacto-detail", args=[self.contacto.pk])

    def test_elimina_contacto(self):
        r = self.client.delete(self.url)
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Contacto.objects.count(), 0)

    def test_delete_inexistente_retorna_404(self):
        url = reverse("contacto-detail", args=[9999])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_404_NOT_FOUND)
