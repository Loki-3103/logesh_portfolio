from app import create_app
from app.extensions import db
from app.models import ContentItem

SAMPLE_CONTENT = [
    {"title": "Skyline Drift", "description": "A getaway driver is pulled back for one last job.", "genre": "Action", "content_type": "movie", "release_year": 2023, "rating": 8.1, "poster_url": "https://picsum.photos/seed/skyline/300/450", "video_url": ""},
    {"title": "Circuit City", "description": "Rival hackers race to expose a corrupt tech giant.", "genre": "Thriller", "content_type": "show", "release_year": 2022, "rating": 7.6, "poster_url": "https://picsum.photos/seed/circuit/300/450", "video_url": ""},
    {"title": "The Last Harvest", "description": "A farming family fights to save their land.", "genre": "Drama", "content_type": "movie", "release_year": 2021, "rating": 7.9, "poster_url": "https://picsum.photos/seed/harvest/300/450", "video_url": ""},
    {"title": "Neon Static", "description": "A synth detective solves crimes in a retro-future city.", "genre": "Sci-Fi", "content_type": "show", "release_year": 2024, "rating": 8.4, "poster_url": "https://picsum.photos/seed/neon/300/450", "video_url": ""},
    {"title": "Paper Lanterns", "description": "Two strangers reconnect during a festival week.", "genre": "Romance", "content_type": "movie", "release_year": 2020, "rating": 7.2, "poster_url": "https://picsum.photos/seed/lanterns/300/450", "video_url": ""},
    {"title": "Deadlock", "description": "A prison break unravels a decade-old conspiracy.", "genre": "Thriller", "content_type": "movie", "release_year": 2023, "rating": 8.0, "poster_url": "https://picsum.photos/seed/deadlock/300/450", "video_url": ""},
    {"title": "Hollow Peaks", "description": "Campers uncover something ancient in the mountains.", "genre": "Horror", "content_type": "movie", "release_year": 2022, "rating": 6.9, "poster_url": "https://picsum.photos/seed/peaks/300/450", "video_url": ""},
    {"title": "Kitchen Rush", "description": "Chefs compete under brutal weekly eliminations.", "genre": "Reality", "content_type": "show", "release_year": 2024, "rating": 7.4, "poster_url": "https://picsum.photos/seed/kitchen/300/450", "video_url": ""},
    {"title": "Quiet Static", "description": "A sound engineer discovers a signal that shouldn't exist.", "genre": "Sci-Fi", "content_type": "movie", "release_year": 2021, "rating": 7.8, "poster_url": "https://picsum.photos/seed/quiet/300/450", "video_url": ""},
    {"title": "Borderlines", "description": "Two agencies clash over a smuggling operation.", "genre": "Action", "content_type": "show", "release_year": 2023, "rating": 8.2, "poster_url": "https://picsum.photos/seed/border/300/450", "video_url": ""},
    {"title": "The Understudy", "description": "An actor's double life spirals out of control.", "genre": "Drama", "content_type": "show", "release_year": 2022, "rating": 8.3, "poster_url": "https://picsum.photos/seed/understudy/300/450", "video_url": ""},
    {"title": "Comic Timing", "description": "Stand-up specials from rising comedians.", "genre": "Comedy", "content_type": "show", "release_year": 2024, "rating": 7.0, "poster_url": "https://picsum.photos/seed/comic/300/450", "video_url": ""},
]


def seed():
    app = create_app("development")
    with app.app_context():
        db.create_all()
        if ContentItem.query.first():
            print("Content already seeded, skipping.")
            return
        for entry in SAMPLE_CONTENT:
            db.session.add(ContentItem(**entry))
        db.session.commit()
        print(f"Seeded {len(SAMPLE_CONTENT)} content items.")


if __name__ == "__main__":
    seed()
