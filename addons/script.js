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

  // 6. Active nav link on click
  document.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      document.querySelectorAll(".nav-link").forEach(function (l) { l.classList.remove("active"); });
      link.classList.add("active");
    });
  });
})();
