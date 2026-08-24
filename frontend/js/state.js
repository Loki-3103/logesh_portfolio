const AppState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token") || null,

  isAuthed() {
    return !!this.token;
  },

  login(user, token) {
    this.user = user;
    this.token = token;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    renderAuthArea();
  },

  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    renderAuthArea();
    location.hash = "#/";
  },
};

function renderAuthArea() {
  const el = document.getElementById("authArea");
  if (AppState.isAuthed()) {
    el.innerHTML = `<span>${AppState.user.username}</span> <button id="logoutBtn">Log out</button>`;
    document.getElementById("logoutBtn").onclick = () => AppState.logout();
  } else {
    el.innerHTML = `<a href="#/login">Sign in</a>`;
  }
}
