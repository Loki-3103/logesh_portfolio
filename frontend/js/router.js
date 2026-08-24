const routes = [];

function route(pattern, handler) {
  const paramNames = [];
  const regex = new RegExp(
    "^" +
      pattern.replace(/:[^/]+/g, (m) => {
        paramNames.push(m.slice(1));
        return "([^/]+)";
      }) +
      "$"
  );
  routes.push({ regex, paramNames, handler });
}

async function resolveRoute() {
  const path = location.hash.slice(1) || "/";
  const app = document.getElementById("app");

  for (const r of routes) {
    const match = path.match(r.regex);
    if (match) {
      const params = {};
      r.paramNames.forEach((name, i) => (params[name] = match[i + 1]));
      app.innerHTML = `<div class="loading">Loading...</div>`;
      try {
        await r.handler(params, app);
      } catch (err) {
        app.innerHTML = `<div class="empty-state">${err.message}</div>`;
      }
      window.scrollTo(0, 0);
      return;
    }
  }
  app.innerHTML = `<div class="empty-state">Page not found.</div>`;
}

window.addEventListener("hashchange", resolveRoute);
window.addEventListener("DOMContentLoaded", () => {
  renderAuthArea();
  resolveRoute();
});
