function requireAuth() {
  if (!AppState.isAuthed()) {
    location.hash = "#/login";
    return false;
  }
  return true;
}

// Landing page: hero + genre rows
route("/", async (params, app) => {
  const items = await Api.listContent();
  if (!items.length) {
    app.innerHTML = `<div class="empty-state">No content yet. Run the seed script to add sample titles.</div>`;
    return;
  }
  const hero = items[0];
  const genres = [...new Set(items.map((i) => i.genre))];
  const rows = genres
    .map((g) => contentRow(g, items.filter((i) => i.genre === g)))
    .join("");

  app.innerHTML = `${heroBanner(hero)}${rows}`;
});

// Browse page: grid with genre filter
route("/browse", async (params, app) => {
  const genres = await Api.listGenres();
  let active = "";

  const renderGrid = async () => {
    const items = await Api.listContent(active ? { genre: active } : {});
    document.getElementById("browseGrid").innerHTML = items.length
      ? items.map(posterCard).join("")
      : `<div class="empty-state">No titles in this genre.</div>`;
  };

  window.__selectGenre = async (g) => {
    active = g;
    document.getElementById("filtersWrap").innerHTML = genreFilters(genres, active, "window.__selectGenre");
    renderGrid();
  };

  app.innerHTML = `
    <div id="filtersWrap">${genreFilters(genres, active, "window.__selectGenre")}</div>
    <div class="grid" id="browseGrid"></div>
  `;
  renderGrid();
});

// Search page: live results
route("/search", async (params, app) => {
  app.innerHTML = `<div class="grid" id="searchResults"></div>`;
  const q = new URLSearchParams(location.hash.split("?")[1] || "").get("q") || "";
  if (!q) {
    document.getElementById("searchResults").innerHTML = `<div class="empty-state">Start typing to search titles.</div>`;
    return;
  }
  const items = await Api.search(q);
  document.getElementById("searchResults").innerHTML = items.length
    ? items.map(posterCard).join("")
    : `<div class="empty-state">No results for "${q}".</div>`;
});

// Content detail page
route("/title/:id", async (params, app) => {
  const { item, similar } = await Api.getContent(params.id);
  let inWatchlist = false;

  if (AppState.isAuthed()) {
    try {
      const list = await Api.getWatchlist();
      inWatchlist = list.some((i) => i.id === item.id);
    } catch (_) {}
  }

  app.innerHTML = `
    <div class="detail">
      <div class="detail-top">
        <img src="${item.poster_url}" alt="${item.title}" />
        <div>
          <div class="hero-title">${item.title}</div>
          <div class="detail-meta">${item.release_year} · ${item.genre} · ${item.content_type} · &#9733; ${item.rating}</div>
          <div class="detail-desc">${item.description}</div>
          <div class="hero-actions" style="margin-top:16px;">
            <button class="btn btn-secondary" id="watchlistBtn">${inWatchlist ? "Remove from My List" : "+ My List"}</button>
          </div>
          ${videoPlayer(item)}
        </div>
      </div>
      ${contentRow("More like this", similar)}
    </div>
  `;

  wireVideoPlayer(item.id);

  document.getElementById("watchlistBtn").onclick = async () => {
    if (!requireAuth()) return;
    if (inWatchlist) {
      await Api.removeFromWatchlist(item.id);
    } else {
      await Api.addToWatchlist(item.id);
    }
    resolveRoute();
  };
});

// Watchlist page
route("/watchlist", async (params, app) => {
  if (!requireAuth()) return;
  const items = await Api.getWatchlist();
  app.innerHTML = items.length
    ? `<div class="grid">${items.map(posterCard).join("")}</div>`
    : `<div class="empty-state">Your list is empty. Add titles from the browse page.</div>`;
});

// History page
route("/history", async (params, app) => {
  if (!requireAuth()) return;
  const items = await Api.getHistory();
  app.innerHTML = items.length
    ? `<div class="grid">${items.map(posterCard).join("")}</div>`
    : `<div class="empty-state">No viewing history yet.</div>`;
});

// Login page
route("/login", async (params, app) => {
  app.innerHTML = authForm("login");
  document.getElementById("submitAuth").onclick = async () => {
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value;
    try {
      const data = await Api.login(email, password);
      AppState.login(data.user, data.token);
      location.hash = "#/";
    } catch (err) {
      document.getElementById("formError").textContent = err.message;
    }
  };
});

// Register page
route("/register", async (params, app) => {
  app.innerHTML = authForm("register");
  document.getElementById("submitAuth").onclick = async () => {
    const username = document.getElementById("usernameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value;
    try {
      const data = await Api.register(username, email, password);
      AppState.login(data.user, data.token);
      location.hash = "#/";
    } catch (err) {
      document.getElementById("formError").textContent = err.message;
    }
  };
});

// Search input wiring (debounced)
let searchDebounce;
document.getElementById("searchInput").addEventListener("input", (e) => {
  clearTimeout(searchDebounce);
  const q = e.target.value.trim();
  searchDebounce = setTimeout(() => {
    location.hash = `#/search?q=${encodeURIComponent(q)}`;
  }, 300);
});
