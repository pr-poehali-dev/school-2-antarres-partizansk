import json
import os
import hashlib
import psycopg2

SCHEMA = "t_p73500416_school_2_antarres_pa"
ROLES = ("student", "parent", "teacher", "director")

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def cors():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
    }

def ok(data: dict, status: int = 200):
    return {"statusCode": status, "headers": {**cors(), "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False)}

def err(msg: str, status: int = 400):
    return {"statusCode": status, "headers": {**cors(), "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}

def handler(event: dict, context) -> dict:
    """Регистрация, вход и профиль пользователей школы. action: register | login | profile"""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors(), "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    action = body.get("action") or params.get("action") or ""

    # ── REGISTER ──────────────────────────────────────────────────────────────
    if method == "POST" and action == "register":
        name = (body.get("name") or "").strip()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""
        role = body.get("role") or ""
        class_name = (body.get("class_name") or "").strip() or None

        if not name or not email or not password or not role:
            return err("Заполните все обязательные поля")
        if role not in ROLES:
            return err("Недопустимая роль")
        if len(password) < 6:
            return err("Пароль должен быть не менее 6 символов")

        conn = get_conn()
        cur = conn.cursor()

        if role == "director":
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.users WHERE role = 'director'")
            if cur.fetchone()[0] > 0:
                conn.close()
                return err("Директор уже зарегистрирован в системе")

        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
        if cur.fetchone():
            conn.close()
            return err("Этот email уже зарегистрирован")

        pw_hash = hash_password(password)
        status = "approved" if role == "director" else "pending"

        cur.execute(
            f"INSERT INTO {SCHEMA}.users (name, email, password_hash, role, class_name, status) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
            (name, email, pw_hash, role, class_name, status)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        msg = "Регистрация прошла успешно" if role == "director" else "Заявка отправлена. Ожидайте подтверждения."
        return ok({"message": msg, "user_id": user_id, "status": status, "role": role}, 201)

    # ── LOGIN ─────────────────────────────────────────────────────────────────
    if method == "POST" and action == "login":
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not email or not password:
            return err("Введите email и пароль")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, name, role, status, class_name FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s",
            (email, hash_password(password))
        )
        row = cur.fetchone()
        conn.close()

        if not row:
            return err("Неверный email или пароль")

        user_id, name, role, status, class_name = row

        if status == "pending":
            return err("Ваша заявка ещё не одобрена администратором", 403)
        if status == "rejected":
            return err("Ваша заявка была отклонена. Обратитесь в школу", 403)

        token = hash_password(f"{user_id}:{email}:{password}")
        return ok({"user_id": user_id, "name": name, "role": role, "class_name": class_name, "token": token})

    # ── PROFILE ───────────────────────────────────────────────────────────────
    if method == "GET" and action == "profile":
        user_id = params.get("user_id")
        if not user_id:
            return err("Не указан user_id")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, name, email, role, class_name, status, created_at FROM {SCHEMA}.users WHERE id = %s",
            (int(user_id),)
        )
        row = cur.fetchone()
        conn.close()

        if not row:
            return err("Пользователь не найден", 404)

        return ok({"id": row[0], "name": row[1], "email": row[2], "role": row[3], "class_name": row[4], "status": row[5], "created_at": str(row[6])})

    return err("Неизвестное действие", 404)
