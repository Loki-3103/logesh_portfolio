// data.js — All editable content. Change anything here and the UI rebuilds automatically.

var PROFILE = {
  name: "Logesh T",
  tagline: "Backend Developer · Final-Year CS & Design Student",
  bio: "I build scalable backend systems and APIs, with a focus on Python, FastAPI, and cloud-native practices. Currently seeking SDE internship and entry-level opportunities.",
  resumeLink: "#",
  linkedinLink: "https://www.linkedin.com/in/logesh-t-828b83390",
  devPasscode: "2201",
  devSection: {
    githubActivity: "[GITHUB_STATS_PLACEHOLDER]",
    architectureNotes: "ReelFind: FastAPI + custom caching layer over TMDb API calls to cut redundant requests.",
    inProgress: "DSA mastery tracker, MAAYAI'26 event site, habit tracker.",
    changelog: "[CHANGELOG_PLACEHOLDER]"
  }
};

var PROJECTS = [
  { title: "ReelFind", tags: "FastAPI · React · TMDb API", url: "https://github.com/Loki-3103/ReelFind" },
  { title: "TAP2TRACK", tags: "Spring Boot · MySQL · SIH 2025", url: "https://github.com/Loki-3103" },
  { title: "Movie recommendation engine", tags: "FastAPI · MySQL · Docker", url: "https://github.com/Loki-3103" }
];

var SKILL_ROWS = [
  {
    label: "Languages & frameworks",
    items: [
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "FastAPI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
      { name: "Flask", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
      { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "DSA", glyph: "</>" },
      { name: "OOP", glyph: "{ }" },
      { name: "System design", glyph: "\u2699" }
    ]
  },
  {
    label: "Cloud & DevOps",
    items: [
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg" },
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "Kubernetes", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
      { name: "Terraform", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg" },
      { name: "Jenkins", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" },
      { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" }
    ]
  },
  {
    label: "Databases & tools",
    items: [
      { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "Nginx", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg" },
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" }
    ]
  },
  {
    label: "Competitive coding",
    items: [
      { name: "LeetCode", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/leetcode/leetcode-original.svg", url: "https://leetcode.com/log_esh7695" },
      { name: "HackerRank", icon: "https://cdn.simpleicons.org/hackerrank/2EC866", url: "https://www.hackerrank.com/logesht3103" }
    ]
  }
];

var CONNECT = [
  { name: "LinkedIn", icon: "https://cdn.simpleicons.org/linkedin/0A66C2", url: "https://www.linkedin.com/in/logesh-t-828b83390" },
  { name: "Email", icon: "https://cdn.simpleicons.org/gmail/EA4335", url: "mailto:logesht3103@gmail.com" },
  { name: "GitHub", icon: "https://cdn.simpleicons.org/github/FFFFFF", url: "https://github.com/Loki-3103" },
  { name: "LeetCode", icon: "https://cdn.simpleicons.org/leetcode/FFA116", url: "https://leetcode.com/log_esh7695" },
  { name: "HackerRank", icon: "https://cdn.simpleicons.org/hackerrank/2EC866", url: "https://www.hackerrank.com/logesht3103" }
];

var BEYOND_CODE = [
  { name: "Pinterest", icon: "https://cdn.simpleicons.org/pinterest/E60023", url: "#" },
  { name: "Letterboxd", icon: "https://cdn.simpleicons.org/letterboxd/00E054", url: "https://letterboxd.com/lokii2201/" }
];

var FAVORITES = ["Inception", "Interstellar", "The Dark Knight", "Se7en"];
