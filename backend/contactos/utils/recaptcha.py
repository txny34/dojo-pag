# contactos/utils/recaptcha.py

import os, requests
VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"

def verify_recaptcha(token, remoteip=None):
    secret = os.environ.get("RECAPTCHA_SECRET_KEY")
    if not secret:
        # así te enterás al toque si el env no cargó
        return False, {"error": "missing-secret-env"}
    payload = {"secret": secret, "response": token}
    if remoteip:
        payload["remoteip"] = remoteip
    try:
        r = requests.post(VERIFY_URL, data=payload, timeout=5)
        data = r.json()
        return bool(data.get("success")), data
    except Exception as e:
        return False, {"error": "request-failed", "exc": str(e)}
