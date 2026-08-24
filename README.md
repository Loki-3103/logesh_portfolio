# StreamPortfolio — Netflix-style Full-Stack Project

A Netflix-inspired streaming catalog app. Flask REST API backend, vanilla JavaScript frontend (no build step required).

## Why vanilla JS instead of React/Vue

React or Vue are reasonable choices here — component reuse (poster cards, rows) and state management (auth, watchlist) map naturally onto either. This project uses **vanilla JavaScript with a small hash router** instead, for two reasons specific to a portfolio deliverable:

1. **Zero build tooling** — no npm install, no bundler, no Node version issues. You open `index.html` (via a static server) and it runs.
2. **Every line is readable code you own** — no framework magic to explain in an interview if someone asks "how does this work."

If you later want to scale this into a bigger app (nested layouts, animations, more complex state), **React with React Router and Zustand/Context for state** is the natural upgrade path — the API layer (`api.js`) and component structure here would port over directly.

## Project structure

```
netflix-portfolio/
├── backend/
│   ├── app/
│   │   ├── __init__.py       # app factory
│   │   ├── config.py         # env-based config
│   │   ├── extensions.py     # db, jwt, cors instances
│   │   ├── models.py         # User, ContentItem, WatchlistItem, HistoryItem
│   │   ├── auth/routes.py    # register, login
│   │   ├── catalog/routes.py # browse, search, genre filter, detail
│   │   ├── watchlist/routes.py
│   │   └── history/routes.py
│   ├── run.py                # dev server entry point
│   ├── seed.py                # sample content loader
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── css/style.css
    └── js/
        ├── api.js            # fetch wrapper + JWT header injection
        ├── state.js          # auth state (localStorage-backed)
        ├── components.js     # render functions (rows, cards, player, forms)
        ├── router.js         # hash-based client router
        └── app.js            # route definitions / page handlers
```

## Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

# optional: create a .env file (see Environment variables below)

python seed.py                # creates dev.db and loads sample titles
python run.py                 # runs on http://localhost:5000
```

## Frontend setup

No build step. Serve the folder with any static server so `fetch` calls work correctly:

```bash
cd frontend
python -m http.server 5500
# open http://localhost:5500
```

If you use VS Code, the "Live Server" extension also works — just make sure it runs on port 5500, or update `CORS_ORIGINS` in the backend config to match whatever port you use.

## Environment variables (backend)

Create `backend/.env` (optional — defaults work for local dev):

```
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
DATABASE_URL=sqlite:///dev.db
CORS_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

For production, set `FLASK_ENV=production` and point `DATABASE_URL` at a real Postgres/MySQL instance.

## API endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account, returns JWT |
| POST | `/api/auth/login` | — | Returns JWT |
| GET | `/api/catalog` | — | List content (`?genre=`, `?type=`) |
| GET | `/api/catalog/genres` | — | List distinct genres |
| GET | `/api/catalog/search?q=` | — | Search by title |
| GET | `/api/catalog/<id>` | — | Detail + similar titles |
| GET | `/api/watchlist` | JWT | List current user's watchlist |
| POST | `/api/watchlist/<id>` | JWT | Add title to watchlist |
| DELETE | `/api/watchlist/<id>` | JWT | Remove title from watchlist |
| GET | `/api/history` | JWT | List viewing history |
| POST | `/api/history/<id>` | JWT | Log a viewing session |

JWT is sent as `Authorization: Bearer <token>`. The frontend stores it in `localStorage` and attaches it automatically for authenticated calls (see `api.js`).

## Sample data

`seed.py` loads 12 sample titles across genres (Action, Sci-Fi, Drama, Thriller, Horror, Comedy, Romance, Reality) using placeholder poster images from picsum.photos. `video_url` is left blank for each — plug in real hosted video URLs (or local files served statically) to make the player functional end to end.

## Notes on the video player

The player component (`components.js` → `videoPlayer` / `wireVideoPlayer`) uses a plain HTML5 `<video>` element with custom play/pause, seekable progress bar, volume, and fullscreen controls — no external player library needed. On pause, it logs progress to `/api/history` for the signed-in user.
