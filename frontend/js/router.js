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

  // Only handle routing for app-specific paths (those starting with /)
  // Section-based navigation (home, projects) is handled by smooth-scroll.js
  if (path === "/" || path.startsWith("/")) {
    updateActiveNavLinkForRoute(path);
  }

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
      // Smooth scroll to app content (home section)
      const homeSection = document.getElementById("home");
      if (homeSection && window.scrollY > 0) {
        homeSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
  }
  app.innerHTML = `<div class="empty-state">Page not found.</div>`;
}

/**
 * Update active nav link based on current route
 * This handles app-specific routes like /browse, /watchlist, etc.
 */
function updateActiveNavLinkForRoute(path) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    
    // Only update for app routes (containing /)
    if (href.includes("/")) {
      link.classList.remove("active");
      const hrefPath = href.slice(1); // Remove #
      if (
        (path === "/" && hrefPath === "/") ||
        (path.startsWith(hrefPath) && hrefPath !== "/")
      ) {
        link.classList.add("active");
      }
    }
  });
}

window.addEventListener("hashchange", resolveRoute);
window.addEventListener("DOMContentLoaded", () => {
  renderAuthArea();
  resolveRoute();
});
