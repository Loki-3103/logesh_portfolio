from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import HistoryItem, ContentItem

history_bp = Blueprint("history", __name__)


@history_bp.get("")
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    items = (
        HistoryItem.query.filter_by(user_id=user_id)
        .order_by(HistoryItem.watched_at.desc())
        .all()
    )
    return jsonify(
        [
            {
                **h.content.to_dict(),
                "watched_at": h.watched_at.isoformat(),
                "progress_seconds": h.progress_seconds,
            }
            for h in items
        ]
    )


@history_bp.post("/<int:content_id>")
@jwt_required()
def log_history(content_id):
    user_id = get_jwt_identity()
    ContentItem.query.get_or_404(content_id)
    data = request.get_json(silent=True) or {}
    progress = int(data.get("progress_seconds", 0))

    entry = HistoryItem(user_id=user_id, content_id=content_id, progress_seconds=progress)
    db.session.add(entry)
    db.session.commit()
    return jsonify({"message": "history logged"}), 201
