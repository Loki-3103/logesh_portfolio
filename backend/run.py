import os
from app import create_app
from app.extensions import db

env = os.environ.get("FLASK_ENV", "development")
app = create_app(env)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=app.config["DEBUG"], port=5000)
