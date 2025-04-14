import { SchoolApp } from "./managers/SchoolApp.js";
import * as utils from "./utils.js";





//=========> Select language
document.getElementById("languageSelect").value = utils.lang;
document.getElementById("languageSelect").addEventListener("change", (e) => {
  utils.setLanguage(e.target.value);
});

// ========>Apply theme
function applyTheme(theme) {
  document.body.classList.remove("light", "dark");
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);
  document.getElementById("toggleThemeBtn").innerText =
    theme === "dark"
      ? `☀️ ${utils.getText("lightMode")}`
      : `🌙 ${utils.getText("darkMode")}`;
}

// =========> When toggled theme button
document.getElementById("toggleThemeBtn").addEventListener("click", () => {
  const current = document.body.classList.contains("dark") ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
});


//========> Export data
document.getElementById("exportBtn").addEventListener("click", () => {
  const keys = ["students", "teachers", "courses", "schedule", "classrooms"];

  const backup = {};
  keys.forEach((key) => {
    const data = localStorage.getItem(key);
    if (data) {
      backup[key] = JSON.parse(data);
    }
  });

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "school_backup.json";
  a.click();
});

//=========> Import data
document.getElementById("importBtn").addEventListener("click", () => {
  document.getElementById("importFile").click();
});

document.getElementById("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);

      Object.keys(data).forEach((key) => {
        localStorage.setItem(key, JSON.stringify(data[key]));
      });

      alert("Data loaded successfully. Page is refreshing...");
      location.reload();
    } catch (err) {
      alert("Upload failed: The file is corrupt or formatted incorrectly.");
      console.error(err);
    }
  };

  reader.readAsText(file);
});


// =========> When page loaded
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  
  utils.applyTranslations();
  const app = new SchoolApp();
  app.init();

  window.app = app;
});

// ======> Refresh language
if (window.app?.refreshLanguage) {
  window.app.refreshLanguage();
}