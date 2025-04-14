import { StudentManager } from "./StudentManager.js";
import { TeacherManager } from "./TeacherManager.js";
import { CourseManager } from "./CourseManager.js";
import { ScheduleManager } from "./ScheduleManager.js";
import { ClassroomManager } from "./ClassroomManager.js";
import { getText } from "../utils.js";

export class SchoolApp {
  constructor() {
    this.contentEl = document.getElementById("content");
    this.studentManager = null;
    this.teacherManger = null;
    this.courseManager = null;
    this.scheduleManager = null;
    this.classroomManager = null;    
 
  }


  init() {
    this.renderMenu();
    // this.renderWelcome();
    this.showDashboard();
  }

  renderMenu() {
    const menu = document.createElement("div");
    menu.id = 'menu';
    menu.innerHTML = `
      <button id="studentBtn">${getText("students")}</button>
      <button id="teacherBtn">${getText("teachers")}</button>
      <button id="courseBtn">${getText("courses")}</button>
      <button id="scheduleBtn">${getText("schedule")}</button>
      <button id="classroomBtn">${getText("classrooms")}</button>
      <button id="dashboardBtn">${getText('dashboard')}</button>
      <button id="settingsBtn">${getText('settings')}</button>


    `;
    this.contentEl.before(menu);

    document.getElementById("studentBtn").addEventListener("click", () => {
      this.showStudents();
    });
    document.getElementById("teacherBtn").addEventListener("click", () => {
      this.showTeachers();
    });
    document.getElementById("courseBtn").addEventListener("click", () => {
      this.showCourses();
    });
    document.getElementById("scheduleBtn").addEventListener("click", () => {
      this.showSchedule();
    });
    document.getElementById("classroomBtn").addEventListener("click", () => {
      this.showClassrooms();
    });
    document.getElementById("dashboardBtn").addEventListener("click", () => {
      this.showDashboard();
    });
    document.getElementById('settingsBtn').addEventListener('click', () => this.showSettings());

  }


  showSettings() {
  this.contentEl.innerHTML = `
    <h2>${getText('settings')}</h2>
    <div class="setting-group">
      <label>${getText('selectTheme')}</label>
      <select id="themeSelect">
        <option value="light">${getText('light')}</option>
        <option value="dark">${getText('dark')}</option>
      </select>
    </div>
    <div class="setting-group">
      <label>${getText('selectLanguage')}</label>
      <select id="languageSelect">
        <option value="en">English</option>
        <option value="tr">Türkçe</option>
      </select>
    </div>
    <hr/>
    <button id="exportBtn">📤 ${getText('exportData')}</button>
    <button id="importBtn">📥 ${getText('importData')}</button>
    <input type="file" id="importFile" hidden accept=".json" />
    <hr/>
    <button id="clearDataBtn">${getText('clearData')}</button>
  `;

  // Seçimleri varsayılan değerlere ayarla
  document.getElementById('themeSelect').value = localStorage.getItem('theme') || 'light';
  document.getElementById('languageSelect').value = localStorage.getItem('language') || 'en';

  // Tema seçimi
  document.getElementById('themeSelect').addEventListener('change', (e) => {
    localStorage.setItem('theme', e.target.value);
    location.reload();
  });

  // Dil seçimi
  document.getElementById('languageSelect').addEventListener('change', (e) => {
    localStorage.setItem('language', e.target.value);
    location.reload();
  });

  // Export işlemi
  document.getElementById('exportBtn').addEventListener('click', () => {
    const keys = ['students', 'teachers', 'courses', 'schedule', 'classrooms'];
    const backup = {};
    keys.forEach(key => {
      backup[key] = JSON.parse(localStorage.getItem(key) || '[]');
    });
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'school-backup.json';
    a.click();
  });

  // Import işlemi
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        Object.keys(data).forEach(key => {
          localStorage.setItem(key, JSON.stringify(data[key]));
        });
        alert('Veriler yüklendi. Sayfa yenileniyor...');
        location.reload();
      } catch {
        alert('Dosya geçersiz.');
      }
    };
    reader.readAsText(file);
  });

  // Verileri sil
  document.getElementById('clearDataBtn').addEventListener('click', () => {
    if (confirm(getText('confirmClear'))) {
      localStorage.clear();
      location.reload();
    }
  });

  window.currentModule = null;
}

  showDashboard() {
    const user = localStorage.getItem('loggedInUser') || 'User';
    this.contentEl.innerHTML = `
      <div class="dashboard-welcome">
        <h1>${getText('welcome')}, ${user} 👋</h1>
        <p>${getText('dashboardDescription')}</p>
      </div>
    `;
  
    const stats = document.createElement('div');
    stats.className = 'dashboard-stats';
  
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const schedule = JSON.parse(localStorage.getItem('schedule') || '[]');
    const classrooms = JSON.parse(localStorage.getItem('classrooms') || '[]');
  
    stats.innerHTML = `
      <div class="stat-card">👨‍🎓 ${getText('students')}: <strong>${students.length}</strong></div>
      <div class="stat-card">👨‍🏫 ${getText('teachers')}: <strong>${teachers.length}</strong></div>
      <div class="stat-card">📘 ${getText('courses')}: <strong>${courses.length}</strong></div>
      <div class="stat-card">🕒 ${getText('schedule')}: <strong>${schedule.length}</strong></div>
      <div class="stat-card">🏫 ${getText('classrooms')}: <strong>${classrooms.length}</strong></div>
    `;
  
    this.contentEl.appendChild(stats);
    window.currentModule = null;
  }
  
  
  renderWelcome() {
    this.contentEl.innerHTML = `
      <p>${getText("home")}</p>
    `;
  }

  showStudents() {
    this.contentEl.innerHTML = "";
    this.studentManager = new StudentManager(this.contentEl);
    this.studentManager.init();
    window.currentModule = this.studentManager;
  }

  showTeachers() {
    this.contentEl.innerHTML = "";
    this.teacherManager = new TeacherManager(this.contentEl);
    this.teacherManager.init();
    window.currentModule = this.teacherManager;
  }

  showCourses() {
    this.contentEl.innerHTML = "";
    const teacherList = JSON.parse(localStorage.getItem("teachers")) || [];
    this.courseManager = new CourseManager(this.contentEl, teacherList);
    this.courseManager.init();
    window.currentModule = this.courseManager;
  }
  showSchedule() {
    this.contentEl.innerHTML = "";
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const teachers = JSON.parse(localStorage.getItem("teachers")) || [];
    const classrooms = JSON.parse(localStorage.getItem("classrooms")) || [];
    this.scheduleManager = new ScheduleManager(
      this.contentEl,
      courses,
      teachers,
      classrooms
    );
    this.scheduleManager.init();
    window.currentModule = this.scheduleManager;
  }
  showClassrooms() {
    this.contentEl.innerHTML = "";
    this.classroomManager = new ClassroomManager(this.contentEl);
    this.classroomManager.init();
    window.currentModule = this.classroomManager;
  }
  showLogin() {
    this.contentEl.innerHTML = "";
    this.loginManager = new LoginManager(this.contentEl);
    this.loginManager.init();
    window.currentModule = this.loginManager;
  }
}
