from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    watchlist_items = db.relationship("WatchlistItem", backref="user", cascade="all, delete-orphan")
    history_items = db.relationship("HistoryItem", backref="user", cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {"id": self.id, "username": self.username, "email": self.email}


class ContentItem(db.Model):
    __tablename__ = "content_items"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, default="")
    genre = db.Column(db.String(100), nullable=False, index=True)
    content_type = db.Column(db.String(20), default="movie")  # movie | show
    release_year = db.Column(db.Integer)
    rating = db.Column(db.Float, default=0.0)
    poster_url = db.Column(db.String(500), default="")
    video_url = db.Column(db.String(500), default="")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "genre": self.genre,
            "content_type": self.content_type,
            "release_year": self.release_year,
            "rating": self.rating,
            "poster_url": self.poster_url,
            "video_url": self.video_url,
        }


class WatchlistItem(db.Model):
    __tablename__ = "watchlist_items"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    content_id = db.Column(db.Integer, db.ForeignKey("content_items.id"), nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)

    content = db.relationship("ContentItem")

    __table_args__ = (db.UniqueConstraint("user_id", "content_id", name="uq_user_content_watchlist"),)


class HistoryItem(db.Model):
    __tablename__ = "history_items"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    content_id = db.Column(db.Integer, db.ForeignKey("content_items.id"), nullable=False)
    watched_at = db.Column(db.DateTime, default=datetime.utcnow)
    progress_seconds = db.Column(db.Integer, default=0)

    content = db.relationship("ContentItem")
