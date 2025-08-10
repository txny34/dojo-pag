# contactos/utils/recaptcha.py
import os
import requests

VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"

def verify_recaptcha(token: str, remoteip: str | None = None) -> bool:
    if not token:
        return False
    payload = {"secret": os.environ.get("RECAPTCHA_SECRET_KEY"), "response": token}
    if remoteip:
        payload["remoteip"] = remoteip
    try:
        r = requests.post(VERIFY_URL, data=payload, timeout=5)
        r.raise_for_status()
        return bool(r.json().get("success"))
    except Exception:
        return False
