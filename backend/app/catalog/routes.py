from flask import Blueprint, request, jsonify
from app.models import ContentItem

catalog_bp = Blueprint("catalog", __name__)


@catalog_bp.get("")
def list_content():
    genre = request.args.get("genre")
    content_type = request.args.get("type")

    query = ContentItem.query
    if genre:
        query = query.filter(ContentItem.genre.ilike(genre))
    if content_type:
        query = query.filter_by(content_type=content_type)

    items = query.order_by(ContentItem.rating.desc()).all()
    return jsonify([item.to_dict() for item in items])


@catalog_bp.get("/genres")
def list_genres():
    genres = [row[0] for row in ContentItem.query.with_entities(ContentItem.genre).distinct()]
    return jsonify(sorted(genres))


@catalog_bp.get("/search")
def search_content():
    q = (request.args.get("q") or "").strip()
    if not q:
        return jsonify([])
    items = ContentItem.query.filter(ContentItem.title.ilike(f"%{q}%")).all()
    return jsonify([item.to_dict() for item in items])


@catalog_bp.get("/<int:content_id>")
def get_content(content_id):
    item = ContentItem.query.get_or_404(content_id)
    similar = (
        ContentItem.query.filter(ContentItem.genre == item.genre, ContentItem.id != item.id)
        .limit(6)
        .all()
    )
    return jsonify({"item": item.to_dict(), "similar": [s.to_dict() for s in similar]})
