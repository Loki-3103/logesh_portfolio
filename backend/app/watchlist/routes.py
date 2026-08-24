from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import WatchlistItem, ContentItem

watchlist_bp = Blueprint("watchlist", __name__)


@watchlist_bp.get("")
@jwt_required()
def get_watchlist():
    user_id = get_jwt_identity()
    items = WatchlistItem.query.filter_by(user_id=user_id).all()
    return jsonify([w.content.to_dict() for w in items])


@watchlist_bp.post("/<int:content_id>")
@jwt_required()
def add_to_watchlist(content_id):
    user_id = get_jwt_identity()
    ContentItem.query.get_or_404(content_id)

    existing = WatchlistItem.query.filter_by(user_id=user_id, content_id=content_id).first()
    if existing:
        return jsonify({"message": "already in watchlist"}), 200

    db.session.add(WatchlistItem(user_id=user_id, content_id=content_id))
    db.session.commit()
    return jsonify({"message": "added to watchlist"}), 201


@watchlist_bp.delete("/<int:content_id>")
@jwt_required()
def remove_from_watchlist(content_id):
    user_id = get_jwt_identity()
    item = WatchlistItem.query.filter_by(user_id=user_id, content_id=content_id).first()
    if not item:
        return jsonify({"error": "not found in watchlist"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "removed from watchlist"})
