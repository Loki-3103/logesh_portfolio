// render.js — Builds the DOM from data.js. Edit data.js only; this file handles rendering.

function render() {
  renderHero();
  renderDevSection();
  renderProjects();
  renderSkills();
  renderBeyondCode();
  renderFavorites();
  renderConnect();
}

function el(tag, attrs, children) {
  var e = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach(function(k) {
      if (k === "className") e.className = attrs[k];
      else if (k === "textContent") e.textContent = attrs[k];
      else if (k === "innerHTML") e.innerHTML = attrs[k];
      else if (k.indexOf("on") === 0) e.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    });
  }
  if (children) {
    if (typeof children === "string") e.innerHTML = children;
    else if (Array.isArray(children)) children.forEach(function(c) { if (c) e.appendChild(c); });
    else e.appendChild(children);
  }
  return e;
}

function renderHero() {
  var app = document.getElementById("app");
  var hero = el("header", { id: "hero", className: "hero" });

  hero.appendChild(el("p", { className: "hero-eyebrow", textContent: "Featured" }));
  hero.appendChild(el("h1", { className: "hero-title", textContent: PROFILE.name }));
  hero.appendChild(el("p", { className: "hero-tagline", textContent: PROFILE.tagline }));
  hero.appendChild(el("p", { className: "hero-desc", textContent: PROFILE.bio }));

  var actions = el("div", { className: "hero-actions" });
  actions.appendChild(el("a", { className: "btn btn-primary", href: PROFILE.resumeLink }, "Resume"));
  actions.appendChild(el("a", { className: "btn btn-secondary", href: PROFILE.linkedinLink, target: "_blank", rel: "noopener" }, "LinkedIn"));
  hero.appendChild(actions);

  app.appendChild(hero);
}

function renderDevSection() {
  var app = document.getElementById("app");
  var section = el("section", { id: "devSection", className: "dev-section hidden" });

  section.appendChild(el("p", { className: "section-label", textContent: "Developer view" }));

  var grid = el("div", { className: "dev-grid" });
  var cards = [
    { title: "GitHub activity", body: PROFILE.devSection.githubActivity },
    { title: "Architecture notes", body: PROFILE.devSection.architectureNotes },
    { title: "In progress", body: PROFILE.devSection.inProgress },
    { title: "Changelog", body: PROFILE.devSection.changelog }
  ];
  cards.forEach(function(c) {
    var card = el("div", { className: "dev-card" });
    card.appendChild(el("h3", { textContent: c.title }));
    card.appendChild(el("p", { textContent: c.body }));
    grid.appendChild(card);
  });
  section.appendChild(grid);
  app.appendChild(section);
}

function renderProjects() {
  var app = document.getElementById("app");
  var section = el("section", { id: "projects", className: "row" });
  section.appendChild(el("p", { className: "row-title", textContent: "Top projects" }));

  var track = el("div", { className: "ranked-track" });

  PROJECTS.forEach(function(project, i) {
    var item = el("div", { className: "ranked-item" });
    item.appendChild(el("span", { className: "rank-number", textContent: String(i + 1) }));

    var poster = el("a", {
      className: "poster",
      href: project.url,
      target: "_blank",
      rel: "noopener"
    });

    if (project.poster) {
      var imgWrap = el("div", { className: "poster-img-wrap" });
      imgWrap.appendChild(el("img", { src: project.poster, alt: project.title }));
      poster.appendChild(imgWrap);
    }

    poster.appendChild(el("div", { className: "poster-fill", textContent: project.title }));
    poster.appendChild(el("p", { className: "poster-tags", textContent: project.tags }));
    item.appendChild(poster);

    track.appendChild(item);
  });

  section.appendChild(track);
  app.appendChild(section);
}

function renderSkills() {
  var app = document.getElementById("app");
  var section = el("section", { id: "skills", className: "row" });

  SKILL_ROWS.forEach(function(row) {
    section.appendChild(el("p", { className: "row-title", textContent: row.label }));

    var track = el("div", { className: "skill-track" });
    row.items.forEach(function(skill) {
      var poster;
      if (skill.url) {
        poster = el("a", {
          className: "skill-poster",
          href: skill.url,
          target: "_blank",
          rel: "noopener"
        });
      } else {
        poster = el("div", { className: "skill-poster" });
      }

      if (skill.icon) {
        poster.appendChild(el("img", { src: skill.icon, alt: skill.name }));
      } else if (skill.glyph) {
        poster.classList.add("skill-poster-text");
        poster.appendChild(el("span", { className: "skill-glyph", textContent: skill.glyph }));
      }

      poster.appendChild(el("span", { textContent: skill.name }));
      track.appendChild(poster);
    });

    section.appendChild(track);
  });

  app.appendChild(section);
}

function renderBeyondCode() {
  var app = document.getElementById("app");
  if (BEYOND_CODE.length === 0) return;

  var section = el("section", { className: "row" });
  section.appendChild(el("p", { className: "row-title", textContent: "Beyond code" }));

  var track = el("div", { className: "skill-track" });
  BEYOND_CODE.forEach(function(item) {
    var card = el("a", {
      className: "skill-poster",
      href: item.url,
      target: "_blank",
      rel: "noopener"
    });
    card.appendChild(el("img", { src: item.icon, alt: item.name }));
    card.appendChild(el("span", { textContent: item.name }));
    track.appendChild(card);
  });
  section.appendChild(track);
  app.appendChild(section);
}

function renderFavorites() {
  var app = document.getElementById("app");
  if (FAVORITES.length === 0) return;

  var section = el("section", { className: "row" });
  section.appendChild(el("p", { className: "row-title", textContent: "Favorites" }));

  var track = el("div", { className: "skill-track" });
  FAVORITES.forEach(function(movie) {
    var card = el("div", { className: "fav-card" });
    var imgWrap = el("div", { className: "fav-poster" });
    imgWrap.appendChild(el("img", { src: movie.poster, alt: movie.title }));
    card.appendChild(imgWrap);
    card.appendChild(el("span", { className: "fav-title", textContent: movie.title }));
    track.appendChild(card);
  });
  section.appendChild(track);
  app.appendChild(section);
}

function renderConnect() {
  var app = document.getElementById("app");
  var section = el("section", { id: "connect", className: "row" });
  section.appendChild(el("p", { className: "row-title", textContent: "Connect" }));

  var track = el("div", { className: "skill-track" });
  CONNECT.forEach(function(item) {
    var card = el("a", {
      className: "skill-poster",
      href: item.url,
      target: "_blank",
      rel: "noopener"
    });
    card.appendChild(el("img", { src: item.icon, alt: item.name }));
    card.appendChild(el("span", { textContent: item.name }));
    track.appendChild(card);
  });
  section.appendChild(track);
  app.appendChild(section);
}

// Expose for script.js
window.renderApp = render;
window.showDevSection = function() {
  var dev = document.getElementById("devSection");
  if (dev) dev.classList.remove("hidden");
};
