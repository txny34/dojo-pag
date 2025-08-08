from flask import Flask, request, jsonify
from flask_cors import CORS  # para permitir conexión desde tu frontend
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import declarative_base, sessionmaker

app = Flask(__name__)
CORS(app, origins=["*"], methods=["GET", "POST", "OPTIONS"])  # CORS más específico

# Configuración de la base de datos
engine = create_engine("sqlite:///contactos.db", echo=False)
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine)

class Contacto(Base):
    __tablename__ = "contactos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    apellido = Column(String(100))
    email = Column(String(200))
    telefono = Column(String(50))
    disciplina = Column(String(50))
    mensaje = Column(Text)

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return "Servidor Flask funcionando 🚀"

@app.get("/debug")
def debug():
    """Endpoint para debuggear las rutas"""
    return jsonify({
        "status": "ok",
        "mensaje": "Debug endpoint funcionando",
        "endpoints_disponibles": [
            "GET /",
            "GET /debug", 
            "POST /contacto",
            "GET /api/contacto",
            "POST /api/contacto",
            "GET /contactos"
        ]
    })

@app.get("/api/contacto")
def contacto_get():
    """Endpoint GET para contacto (por si el frontend lo necesita)"""
    return jsonify({
        "status": "ok",
        "mensaje": "Endpoint GET /api/contacto funcionando"
    })

@app.post("/api/contacto")
def contacto_api():
    """Endpoint POST para contacto con ruta /api/contacto"""
    print("=== NUEVA PETICIÓN RECIBIDA EN /api/contacto ===")
    data = request.get_json(force=True) or {}
    print("Datos recibidos:", data)
    
    nombre = data.get("nombre", "").strip()
    apellido = data.get("apellido", "").strip()
    email = data.get("email", "").strip()
    telefono = data.get("telefono", "").strip()
    disciplina = data.get("disciplina", "").strip()
    mensaje = data.get("mensaje", "").strip()
    
    print(f"Campos procesados:")
    print(f"  nombre: '{nombre}' (longitud: {len(nombre)})")
    print(f"  apellido: '{apellido}' (longitud: {len(apellido)})")
    print(f"  email: '{email}'")
    print(f"  telefono: '{telefono}'")
    print(f"  disciplina: '{disciplina}'")
    print(f"  mensaje: '{mensaje}' (longitud: {len(mensaje)})")

    # Validaciones con logging
    if not nombre or len(nombre) < 2:
        print("❌ Error: Nombre inválido")
        return jsonify({"status": "error", "mensaje": "Nombre inválido"}), 400
    if not apellido or len(apellido) < 2:
        print("❌ Error: Apellido inválido")
        return jsonify({"status": "error", "mensaje": "Apellido inválido"}), 400
    if "@" not in email or "." not in email:
        print("❌ Error: Email inválido")
        return jsonify({"status": "error", "mensaje": "Correo electrónico inválido"}), 400
    if telefono and not telefono.isdigit():
        print("❌ Error: Teléfono inválido")
        return jsonify({"status": "error", "mensaje": "Teléfono inválido"}), 400
    disciplinas_validas = ["boxeo", "muay-thai", "k1", "jiu-jitsu"]
    if disciplina.lower() not in [d.lower() for d in disciplinas_validas]:
        print(f"❌ Error: Disciplina '{disciplina}' no válida. Permitidas: {disciplinas_validas}")
        return jsonify({"status": "error", "mensaje": "Disciplina inválida"}), 400
    if len(mensaje) > 500:
        print("❌ Error: Mensaje demasiado largo")
        return jsonify({"status": "error", "mensaje": "Mensaje demasiado largo"}), 400
    
    print("✅ Todas las validaciones pasaron")

    # Guardado en DB
    db = SessionLocal()
    try:
        nuevo_contacto = Contacto(
            nombre=nombre,
            apellido=apellido,
            email=email,
            telefono=telefono,
            disciplina=disciplina,
            mensaje=mensaje
        )
        db.add(nuevo_contacto)
        db.commit()
        print("Nuevo contacto guardado en DB:", data)
        return jsonify({
            "status": "ok",
            "mensaje": f"Gracias {nombre}, recibimos tu solicitud para {disciplina}.",
            "id": nuevo_contacto.id
        })
    except Exception as e:
        db.rollback()
        print("Error al guardar contacto:", str(e))
        return jsonify({"status": "error", "mensaje": "Error al procesar tu solicitud"}), 500
    finally:
        db.close()

@app.post("/contacto")
def contacto():
    """Endpoint POST para contacto con ruta /contacto"""
    print("=== NUEVA PETICIÓN RECIBIDA EN /contacto ===")
    data = request.get_json(force=True) or {}
    print("Datos recibidos:", data)
    
    nombre = data.get("nombre", "").strip()
    apellido = data.get("apellido", "").strip()
    email = data.get("email", "").strip()
    telefono = data.get("telefono", "").strip()
    disciplina = data.get("disciplina", "").strip()
    mensaje = data.get("mensaje", "").strip()
    
    print(f"Campos procesados:")
    print(f"  nombre: '{nombre}' (longitud: {len(nombre)})")
    print(f"  apellido: '{apellido}' (longitud: {len(apellido)})")
    print(f"  email: '{email}'")
    print(f"  telefono: '{telefono}'")
    print(f"  disciplina: '{disciplina}'")
    print(f"  mensaje: '{mensaje}' (longitud: {len(mensaje)})")

    # Validaciones con logging
    if not nombre or len(nombre) < 2:
        print("❌ Error: Nombre inválido")
        return jsonify({"status": "error", "mensaje": "Nombre inválido"}), 400
    if not apellido or len(apellido) < 2:
        print("❌ Error: Apellido inválido")
        return jsonify({"status": "error", "mensaje": "Apellido inválido"}), 400
    if "@" not in email or "." not in email:
        print("❌ Error: Email inválido")
        return jsonify({"status": "error", "mensaje": "Correo electrónico inválido"}), 400
    if telefono and not telefono.isdigit():
        print("❌ Error: Teléfono inválido")
        return jsonify({"status": "error", "mensaje": "Teléfono inválido"}), 400
    disciplinas_validas = ["boxeo", "muay-thai", "k1", "jiu-jitsu"]
    if disciplina.lower() not in [d.lower() for d in disciplinas_validas]:
        print(f"❌ Error: Disciplina '{disciplina}' no válida. Permitidas: {disciplinas_validas}")
        return jsonify({"status": "error", "mensaje": "Disciplina inválida"}), 400
    if len(mensaje) > 500:
        print("❌ Error: Mensaje demasiado largo")
        return jsonify({"status": "error", "mensaje": "Mensaje demasiado largo"}), 400
    
    print("✅ Todas las validaciones pasaron")

    # Guardado en DB
    db = SessionLocal()
    try:
        nuevo_contacto = Contacto(
            nombre=nombre,
            apellido=apellido,
            email=email,
            telefono=telefono,
            disciplina=disciplina,
            mensaje=mensaje
        )
        db.add(nuevo_contacto)
        db.commit()
        print("Nuevo contacto guardado en DB:", data)
        return jsonify({
            "status": "ok",
            "mensaje": f"Gracias {nombre}, recibimos tu solicitud para {disciplina}.",
            "id": nuevo_contacto.id
        })
    except Exception as e:
        db.rollback()
        print("Error al guardar contacto:", str(e))
        return jsonify({"status": "error", "mensaje": "Error al procesar tu solicitud"}), 500
    finally:
        db.close()

@app.get("/contactos")
def obtener_contactos():
    """Endpoint para obtener todos los contactos"""
    db = SessionLocal()
    try:
        contactos = db.query(Contacto).all()
        return jsonify({
            "status": "ok",
            "contactos": [
                {
                    "id": c.id,
                    "nombre": c.nombre,
                    "apellido": c.apellido,
                    "email": c.email,
                    "telefono": c.telefono,
                    "disciplina": c.disciplina,
                    "mensaje": c.mensaje
                }
                for c in contactos
            ]
        })
    except Exception as e:
        print("Error al obtener contactos:", str(e))
        return jsonify({
            "status": "error",
            "mensaje": "Error al obtener los contactos"
        }), 500
    finally:
        db.close()

if __name__ == "__main__":
    app.run(debug=True)
