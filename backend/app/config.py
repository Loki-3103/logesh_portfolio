import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))


class BaseConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY", "change-me-in-prod")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "change-me-too")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=6)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:5500,http://127.0.0.1:5500").split(",")


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", f"sqlite:///{os.path.join(basedir, 'dev.db')}"
    )


class ProductionConfig(BaseConfig):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "")


config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}
