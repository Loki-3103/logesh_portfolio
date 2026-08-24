const DEV_PASSCODE = "2201";

const introScreen = document.getElementById("introScreen");
const profileScreen = document.getElementById("profileScreen");
const mainSite = document.getElementById("mainSite");
const devSection = document.getElementById("devSection");
const passcodeBox = document.getElementById("passcodeBox");
const passcodeInput = document.getElementById("passcodeInput");
const passcodeSubmit = document.getElementById("passcodeSubmit");
const passcodeError = document.getElementById("passcodeError");

// Show who's watching after intro finishes
setTimeout(() => {
  introScreen.classList.add("hidden");
  profileScreen.classList.remove("hidden");
}, 2100);

let pendingDeveloperUnlock = false;

document.querySelectorAll(".profile-card").forEach((card) => {
  card.addEventListener("click", () => {
    const profile = card.dataset.profile;

    if (profile === "developer") {
      pendingDeveloperUnlock = true;
      passcodeBox.classList.remove("hidden");
      passcodeInput.focus();
      return;
    }

    enterSite(profile);
  });
});

passcodeSubmit.addEventListener("click", checkPasscode);
passcodeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkPasscode();
});

function checkPasscode() {
  if (passcodeInput.value === DEV_PASSCODE) {
    enterSite("developer");
  } else {
    passcodeError.textContent = "Incorrect passcode.";
    passcodeInput.value = "";
  }
}

function enterSite(profile) {
  profileScreen.classList.add("hidden");
  mainSite.classList.remove("hidden");

  if (profile === "developer") {
    devSection.classList.remove("hidden");
  }
}
