"""
app.py - Main Flask Application Entry Point
XAI-based Intrusion Detection System
"""

import os
from flask import Flask
from flask_cors import CORS

from extensions import db, jwt
from config import DevelopmentConfig


def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)

    # Create folders safely
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    os.makedirs(app.config["MODEL_FOLDER"], exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)

    # Enable CORS for frontend (add your Vercel URL later)
    CORS(
    app,
    resources={r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://xai-ids.vercel.app",
            "https://xai-ids-livid.vercel.app"
        ]
    }},
    supports_credentials=True
)

    # Import and register blueprints
    from routes.auth import auth_bp
    from routes.upload import upload_bp
    from routes.train import train_bp
    from routes.predict import predict_bp
    from routes.explain import explain_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(upload_bp, url_prefix="/api")
    app.register_blueprint(train_bp, url_prefix="/api")
    app.register_blueprint(predict_bp, url_prefix="/api")
    app.register_blueprint(explain_bp, url_prefix="/api")

    # ✅ Home route
    @app.route("/")
    def home():
        return "🚀 XAI-IDS Backend is running successfully"

    return app


# ✅ IMPORTANT: Global app instance for Gunicorn (Railway)
app = create_app()


# Local development run
if __name__ == "__main__":
    print("🚀 XAI-IDS Backend running on http://localhost:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
