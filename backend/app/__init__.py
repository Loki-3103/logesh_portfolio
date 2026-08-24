from flask import Flask, jsonify
from app.config import config_by_name
from app.extensions import db, jwt, cors


def create_app(env="development"):
    app = Flask(__name__)
    app.config.from_object(config_by_name[env])

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

    from app.auth.routes import auth_bp
    from app.catalog.routes import catalog_bp
    from app.watchlist.routes import watchlist_bp
    from app.history.routes import history_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(catalog_bp, url_prefix="/api/catalog")
    app.register_blueprint(watchlist_bp, url_prefix="/api/watchlist")
    app.register_blueprint(history_bp, url_prefix="/api/history")

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    return app
