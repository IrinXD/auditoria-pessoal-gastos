from datetime import UTC, date, datetime
from pathlib import Path
from threading import Lock
from uuid import uuid4

from flask import Flask, jsonify, request, send_from_directory


app = Flask(__name__)
app.json.ensure_ascii = False
PROJECT_ROOT = Path(__file__).resolve().parent.parent


def utc_timestamp(timespec="seconds"):
    return datetime.now(UTC).isoformat(timespec=timespec).replace("+00:00", "Z")


ALLOWED_CATEGORIES = {
    "Comida",
    "Transporte",
    "Moradia",
    "Lazer",
    "Saúde",
    "Educação",
    "Outros",
}

# Demonstração em memória: os dados podem reiniciar a cada cold start no Vercel.
EXPENSES = [
    {
        "id": "demo-1",
        "amount": 89.90,
        "category": "Comida",
        "date": date.today().isoformat(),
        "description": "Compras no mercado",
        "created_at": utc_timestamp(),
    },
    {
        "id": "demo-2",
        "amount": 42.50,
        "category": "Transporte",
        "date": date.today().isoformat(),
        "description": "Aplicativo de transporte",
        "created_at": utc_timestamp(),
    },
    {
        "id": "demo-3",
        "amount": 159.00,
        "category": "Lazer",
        "date": date.today().isoformat(),
        "description": "Jantar e cinema",
        "created_at": utc_timestamp(),
    },
    {
        "id": "demo-4",
        "amount": 64.90,
        "category": "Saúde",
        "date": date.today().isoformat(),
        "description": "Farmácia",
        "created_at": utc_timestamp(),
    },
]
EXPENSES_LOCK = Lock()


def validate_expense(payload):
    errors = []
    if not isinstance(payload, dict):
        return ["O corpo da requisição deve ser um objeto JSON."]

    try:
        amount = float(payload.get("amount", 0))
        if amount <= 0 or amount > 99_999_999:
            errors.append("O valor deve ser maior que zero.")
    except (TypeError, ValueError):
        errors.append("O valor informado é inválido.")

    if payload.get("category") not in ALLOWED_CATEGORIES:
        errors.append("Selecione uma categoria válida.")

    description = str(payload.get("description", "")).strip()
    if not description:
        errors.append("A descrição é obrigatória.")
    elif len(description) > 80:
        errors.append("A descrição deve ter no máximo 80 caracteres.")

    try:
        expense_date = date.fromisoformat(str(payload.get("date", "")))
        if expense_date > date.today():
            errors.append("A data não pode estar no futuro.")
    except ValueError:
        errors.append("Informe uma data válida no formato AAAA-MM-DD.")

    return errors


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/")
def local_frontend():
    """Serve o frontend quando o arquivo é executado localmente."""
    return send_from_directory(PROJECT_ROOT, "index.html")


@app.get("/style.css")
@app.get("/app.js")
def local_asset():
    """Expõe apenas os assets necessários ao servidor de desenvolvimento."""
    return send_from_directory(PROJECT_ROOT, request.path.lstrip("/"))


@app.get("/api/expenses")
def list_expenses():
    with EXPENSES_LOCK:
        expenses = sorted(
            EXPENSES,
            key=lambda item: (item["date"], item["created_at"]),
            reverse=True,
        )
        return jsonify({"expenses": expenses, "count": len(expenses)})


@app.post("/api/expenses")
def create_expense():
    payload = request.get_json(silent=True)
    errors = validate_expense(payload)
    if errors:
        return jsonify({"error": errors[0], "errors": errors}), 400

    expense = {
        "id": str(uuid4()),
        "amount": round(float(payload["amount"]), 2),
        "category": payload["category"],
        "date": payload["date"],
        "description": payload["description"].strip(),
        "created_at": utc_timestamp("milliseconds"),
    }
    with EXPENSES_LOCK:
        EXPENSES.append(expense)
    return jsonify(expense), 201


@app.delete("/api/expenses/<expense_id>")
def delete_expense(expense_id):
    with EXPENSES_LOCK:
        index = next(
            (i for i, expense in enumerate(EXPENSES) if expense["id"] == expense_id),
            None,
        )
        if index is None:
            return jsonify({"error": "Gasto não encontrado."}), 404
        EXPENSES.pop(index)
    return "", 204


@app.errorhandler(404)
def not_found(_error):
    return jsonify({"error": "Rota não encontrada."}), 404


@app.errorhandler(405)
def method_not_allowed(_error):
    return jsonify({"error": "Método não permitido."}), 405


if __name__ == "__main__":
    app.run(debug=True, port=5000)
