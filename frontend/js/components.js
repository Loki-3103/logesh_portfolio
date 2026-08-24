function posterCard(item) {
  return `
    <div class="poster" onclick="location.hash='#/title/${item.id}'">
      <img src="${item.poster_url}" alt="${item.title}" loading="lazy" />
      <div class="poster-title">${item.title}</div>
    </div>
  `;
}

function contentRow(title, items) {
  if (!items.length) return "";
  return `
    <div class="row">
      <div class="row-title">${title}</div>
      <div class="row-track">
        ${items.map(posterCard).join("")}
      </div>
    </div>
  `;
}

function heroBanner(item) {
  return `
    <div class="hero" style="background-image:url('${item.poster_url}')">
      <div class="hero-content">
        <div class="hero-title">${item.title}</div>
        <div class="hero-desc">${item.description}</div>
        <div class="hero-actions">
          <button class="btn btn-primary" onclick="location.hash='#/title/${item.id}'">&#9654; Play</button>
          <button class="btn btn-secondary" onclick="location.hash='#/title/${item.id}'">More info</button>
        </div>
      </div>
    </div>
  `;
}

function videoPlayer(item) {
  const src = item.video_url || "";
  return `
    <div class="player-wrap">
      ${
        src
          ? `<video id="videoEl" class="player" src="${src}"></video>`
          : `<div class="loading">No video source set for this title yet.</div>`
      }
      <div class="player-controls">
        <button id="playPauseBtn">&#9654;</button>
        <div class="progress-bar" id="progressBar"><div class="progress-fill" id="progressFill"></div></div>
        <input type="range" id="volumeSlider" class="volume-slider" min="0" max="1" step="0.05" value="1" />
        <button id="fullscreenBtn">&#9974;</button>
      </div>
    </div>
  `;
}

function wireVideoPlayer(contentId) {
  const video = document.getElementById("videoEl");
  const playBtn = document.getElementById("playPauseBtn");
  const progressBar = document.getElementById("progressBar");
  const progressFill = document.getElementById("progressFill");
  const volumeSlider = document.getElementById("volumeSlider");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  if (!video) return;

  playBtn.onclick = () => {
    if (video.paused) {
      video.play();
      playBtn.innerHTML = "&#10074;&#10074;";
    } else {
      video.pause();
      playBtn.innerHTML = "&#9654;";
    }
  };

  video.ontimeupdate = () => {
    const pct = (video.currentTime / video.duration) * 100 || 0;
    progressFill.style.width = `${pct}%`;
  };

  progressBar.onclick = (e) => {
    const rect = progressBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  };

  volumeSlider.oninput = (e) => {
    video.volume = parseFloat(e.target.value);
  };

  fullscreenBtn.onclick = () => {
    if (video.requestFullscreen) video.requestFullscreen();
  };

  video.onpause = () => {
    if (AppState.isAuthed()) {
      Api.logHistory(contentId, Math.floor(video.currentTime)).catch(() => {});
    }
  };
}

function genreFilters(genres, active, onSelect) {
  return `
    <div class="filters">
      <button class="filter-chip ${!active ? "active" : ""}" onclick="(${onSelect})('')">All</button>
      ${genres
        .map(
          (g) =>
            `<button class="filter-chip ${active === g ? "active" : ""}" onclick="(${onSelect})('${g}')">${g}</button>`
        )
        .join("")}
    </div>
  `;
}

function authForm(mode) {
  const isLogin = mode === "login";
  return `
    <div class="auth-form">
      <h2>${isLogin ? "Sign in" : "Create account"}</h2>
      <div class="form-error" id="formError"></div>
      ${!isLogin ? `<input type="text" id="usernameInput" placeholder="Username" />` : ""}
      <input type="email" id="emailInput" placeholder="Email" />
      <input type="password" id="passwordInput" placeholder="Password" />
      <button id="submitAuth">${isLogin ? "Sign in" : "Sign up"}</button>
      <div class="switch">
        ${isLogin ? "New here?" : "Already have an account?"}
        <a href="#/${isLogin ? "register" : "login"}">${isLogin ? "Create an account" : "Sign in"}</a>
      </div>
    </div>
  `;
}
