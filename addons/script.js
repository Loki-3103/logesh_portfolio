// script.js — Intro animation, profile picker, passcode gate, avatar swap, nav scroll.

(function () {
  var introScreen = document.getElementById("introScreen");
  var profileScreen = document.getElementById("profileScreen");
  var mainSite = document.getElementById("mainSite");
  var passcodeBox = document.getElementById("passcodeBox");
  var passcodeInput = document.getElementById("passcodeInput");
  var passcodeSubmit = document.getElementById("passcodeSubmit");
  var passcodeError = document.getElementById("passcodeError");

  var avatarImg = document.getElementById("avatarImg");
  var avatarWrap = document.getElementById("avatarWrap");
  var avatarDropdown = document.getElementById("avatarDropdown");
  var dropdownName = document.getElementById("dropdownName");
  var switchBtn = document.getElementById("switchProfileBtn");

  var AVATAR_MAP = {
    recruiter: "images/recruiter.jpg",
    developer: "images/developer.jpg",
    browsing: "images/just_browsing.jpg"
  };

  var NAME_MAP = {
    recruiter: "Recruiter",
    developer: "Developer",
    browsing: "Just browsing"
  };

  // 1. Intro
  setTimeout(function () {
    introScreen.classList.add("hidden");
    profileScreen.classList.remove("hidden");
  }, 2100);

  // 2. Profile cards
  document.querySelectorAll(".profile-card").forEach(function (card) {
    card.addEventListener("click", function () {
      var profile = card.dataset.profile;
      if (profile === "developer") {
        passcodeBox.classList.remove("hidden");
        passcodeInput.focus();
        return;
      }
      enterSite(profile);
    });
  });

  // 3. Passcode
  passcodeSubmit.addEventListener("click", checkPasscode);
  passcodeInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") checkPasscode();
  });

  function checkPasscode() {
    if (passcodeInput.value === PROFILE.devPasscode) {
      enterSite("developer");
    } else {
      passcodeError.textContent = "Incorrect passcode.";
      passcodeInput.value = "";
    }
  }

  function enterSite(profile) {
    profileScreen.classList.add("hidden");
    mainSite.classList.remove("hidden");

    avatarImg.src = AVATAR_MAP[profile] || "";
    dropdownName.textContent = NAME_MAP[profile] || profile;

    if (typeof renderApp === "function") renderApp();

    if (profile === "developer") {
      if (typeof showDevSection === "function") showDevSection();
    }

    // Setup nav AFTER renderApp creates the DOM
    setupNavScroll();
  }

  // 4. Avatar dropdown
  avatarWrap.addEventListener("click", function (e) {
    e.stopPropagation();
    avatarDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", function () {
    avatarDropdown.classList.add("hidden");
  });

  switchBtn.addEventListener("click", function () {
    window.location.reload();
  });

  // === NAV SCROLL ===
  var HEADER_HEIGHT = 60;
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function smoothScrollTo(targetY) {
    if (prefersReducedMotion) {
      window.scrollTo(0, targetY);
      return;
    }
    var startY = window.pageYOffset;
    var distance = targetY - startY;
    var duration = Math.min(600, Math.max(280, Math.abs(distance) * 0.6));
    var startTime = null;

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function getOffsetTop(el) {
    var top = 0;
    while (el) { top += el.offsetTop; el = el.offsetParent; }
    return top - HEADER_HEIGHT;
  }

  function setActiveLink(section) {
    document.querySelectorAll(".nav-link").forEach(function (link) {
      var s = link.getAttribute("data-section");
      link.classList.toggle("active", s === section);
    });
  }

  function setupNavScroll() {
    document.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var section = link.getAttribute("data-section");
        var target = null;

        if (section === "home") {
          smoothScrollTo(0);
          setActiveLink("home");
          return;
        }

        if (section === "projects" || section === "skills") {
          target = document.getElementById("projects");
        } else if (section === "connect") {
          target = document.getElementById("connect");
        }

        if (target) {
          smoothScrollTo(getOffsetTop(target));
          setActiveLink(section);
        }
      });
    });

    // IntersectionObserver for scroll-based active state
    var targets = [
      { id: "hero", section: "home" },
      { id: "projects", section: "projects" },
      { id: "connect", section: "connect" }
    ];

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var match = targets.find(function (t) { return t.id === entry.target.id; });
            if (match) {
              // When projects section is visible, keep whichever was last clicked
              if (match.section === "projects") {
                var active = document.querySelector(".nav-link.active");
                if (active) {
                  var s = active.getAttribute("data-section");
                  if (s === "projects" || s === "skills") return;
                }
              }
              setActiveLink(match.section);
            }
          }
        });
      }, {
        rootMargin: "-" + HEADER_HEIGHT + "px 0px -40% 0px",
        threshold: 0
      });

      targets.forEach(function (t) {
        var el = document.getElementById(t.id);
        if (el) observer.observe(el);
      });
    }

    // Navbar background + scroll progress bar on scroll
    var navbar = document.getElementById("navbar");
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var y = window.pageYOffset;
          navbar.style.background = y > 20
            ? "rgba(20,20,20,0.98)"
            : "linear-gradient(180deg, #141414 0%, rgba(20,20,20,0.95) 60%, rgba(20,20,20,0.7) 100%)";

          // Scroll progress bar
          var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          var pct = maxScroll > 0 ? Math.min((y / maxScroll) * 100, 100) : 0;
          navbar.style.setProperty("--scroll-pct", pct);

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
})();
