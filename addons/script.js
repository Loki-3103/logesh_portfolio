// script.js — Intro animation, profile picker, passcode gate, avatar swap.

(function () {
  var introScreen = document.getElementById("introScreen");
  var profileScreen = document.getElementById("profileScreen");
  var mainSite = document.getElementById("mainSite");
  var passcodeBox = document.getElementById("passcodeBox");
  var passcodeInput = document.getElementById("passcodeInput");
  var passcodeSubmit = document.getElementById("passcodeSubmit");
  var passcodeError = document.getElementById("passcodeError");

  // Avatar / dropdown elements
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

  // 1. Show who's watching after intro finishes (~2.1s)
  setTimeout(function () {
    introScreen.classList.add("hidden");
    profileScreen.classList.remove("hidden");
  }, 2100);

  // 2. Profile card clicks
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

  // 3. Passcode check
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

    // Set navbar avatar
    avatarImg.src = AVATAR_MAP[profile] || "";
    dropdownName.textContent = NAME_MAP[profile] || profile;

    // Render all content from data.js
    if (typeof renderApp === "function") renderApp();

    if (profile === "developer") {
      if (typeof showDevSection === "function") showDevSection();
    }
  }

  // 4. Avatar dropdown toggle
  avatarWrap.addEventListener("click", function (e) {
    e.stopPropagation();
    avatarDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", function () {
    avatarDropdown.classList.add("hidden");
  });

  // 5. Switch profile — reload to restart intro + picker
  switchBtn.addEventListener("click", function () {
    window.location.reload();
  });

  // 6. Navigation scroll behavior
  var HEADER_HEIGHT = 60;
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function smoothScrollTo(targetY) {
    if (prefersReducedMotion) {
      window.scrollTo(0, targetY);
      return;
    }
    var startY = window.pageYOffset;
    var distance = targetY - startY;
    var duration = 600;
    var startTime = null;

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function getOffsetTop(el) {
    var top = 0;
    while (el) { top += el.offsetTop; el = el.offsetParent; }
    return top - HEADER_HEIGHT;
  }

  var navLinks = document.querySelectorAll(".nav-link");

  function setActiveLink(section) {
    navLinks.forEach(function (link) {
      var s = link.getAttribute("data-section");
      if (s === "home" && section === "home") link.classList.add("active");
      else if (s === "projects" && (section === "projects" || section === "skills")) link.classList.add("active");
      else if (s === "skills" && (section === "projects" || section === "skills")) link.classList.add("active");
      else if (s === "connect" && section === "connect") link.classList.add("active");
      else link.classList.remove("active");
    });
  }

  navLinks.forEach(function (link) {
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

    link.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        link.click();
      }
    });
  });

  // 7. IntersectionObserver for active state on scroll
  var observerTargets = [
    { id: "hero", section: "home" },
    { id: "projects", section: "projects" },
    { id: "connect", section: "connect" }
  ];

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var match = observerTargets.find(function (t) { return t.id === entry.target.id; });
        if (match) setActiveLink(match.section);
      }
    });
  }, {
    rootMargin: "-" + HEADER_HEIGHT + "px 0px -40% 0px",
    threshold: 0
  });

  observerTargets.forEach(function (t) {
    var el = document.getElementById(t.id);
    if (el) observer.observe(el);
  });

  // 8. Scroll-based navbar background opacity
  var navbar = document.getElementById("navbar");
  var scrollHandler = (function () {
    var ticking = false;
    return function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrolled = window.pageYOffset > 20;
          navbar.style.background = scrolled
            ? "rgba(20,20,20,0.98)"
            : "linear-gradient(180deg, #141414 0%, rgba(20,20,20,0.95) 60%, rgba(20,20,20,0.7) 100%)";
          ticking = false;
        });
        ticking = true;
      }
    };
  })();

  window.addEventListener("scroll", scrollHandler, { passive: true });
})();
