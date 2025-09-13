from flask import Flask, render_template, request, jsonify, abort
import requests

# Inicialización de la aplicación Flask
flask_app = Flask(__name__)

# Configuración base para Ollama
OLLAMA_BASE_URL = "http://localhost:11434/api"
DEFAULT_MODEL = "deepseek-coder"


@flask_app.route("/")
def home():
    """Renderiza la página principal"""
    return render_template("index.html")


@flask_app.route("/models", methods=["GET"])
def list_models():
    """
    Devuelve los modelos disponibles desde Ollama
    """
    try:
        resp = requests.get(f"{OLLAMA_BASE_URL}/tags", timeout=30)
        if resp.status_code != 200:
            abort(502, description="No se pudieron obtener los modelos de Ollama")
        models_info = resp.json().get("models", [])
        model_names = [m.get("name") for m in models_info]
        return jsonify({"models": model_names})
    except requests.exceptions.ConnectionError:
        abort(503, description="No hay conexión con Ollama")
    except Exception as err:
        abort(500, description=f"Error inesperado: {err}")


@flask_app.route("/generate", methods=["POST"])
def generate_text():
    """
    Usa el endpoint /generate de Ollama para obtener texto a partir de un prompt
    """
    payload = request.get_json(force=True)
    prompt = payload.get("prompt")
    model = payload.get("model", DEFAULT_MODEL)

    if not prompt:
        abort(400, description="El campo 'prompt' está vacío")

    request_data = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }

    try:
        resp = requests.post(
            f"{OLLAMA_BASE_URL}/generate",
            json=request_data,
            headers={"Content-Type": "application/json"},
            timeout=60
        )
        if resp.status_code == 200:
            result = resp.json().get("response", "")
            return jsonify({"response": result, "model": model})
        else:
            abort(resp.status_code, description=f"Error en Ollama: {resp.text}")
    except requests.exceptions.ConnectionError:
        abort(503, description="No se puede conectar a Ollama")
    except Exception as err:
        abort(500, description=f"Fallo interno: {err}")


@flask_app.route("/chat", methods=["POST"])
def chat_with_model():
    """
    Usa el endpoint /chat de Ollama para mantener un estilo conversacional
    """
    payload = request.get_json(force=True)
    message = payload.get("message")
    model = payload.get("model", DEFAULT_MODEL)

    if not message:
        abort(400, description="El campo 'message' está vacío")

    chat_body = {
        "model": model,
        "messages": [{"role": "user", "content": message}],
        "stream": False
    }

    try:
        resp = requests.post(
            f"{OLLAMA_BASE_URL}/chat",
            json=chat_body,
            headers={"Content-Type": "application/json"},
            timeout=60
        )
        if resp.status_code == 200:
            reply = resp.json().get("message", {}).get("content", "")
            return jsonify({"response": reply, "model": model})
        else:
            abort(resp.status_code, description=f"Error en Ollama: {resp.text}")
    except requests.exceptions.Timeout:
        abort(408, description="Timeout: Ollama no respondió a tiempo")
    except Exception as err:
        abort(500, description=f"Error inesperado: {err}")


if __name__ == "__main__":
    flask_app.run(host="0.0.0.0", port=5000, debug=True)
