import { getText } from "../utils.js";

export class ScheduleManager {
  constructor(container,courses = [], teachers = [],classrooms = []) {
    this.container = container;
    this.schedule = this.loadFromStorage();
    this.courses = courses;
    this.teachers = teachers;
    this.classrooms = classrooms;
    this.form = null;
    this.table = null;
  }

  init() {
    this.renderForm();
    this.renderTable();
  }

  refreshLanguage() {
    this.container.innerHTML = '';
    this.init();
  }
  loadFromStorage() {
    const data = localStorage.getItem("schedule");
    return data ? JSON.parse(data) : [];
  }

  saveToStorage() {
    localStorage.setItem("schedule", JSON.stringify(this.schedule));
  }

  renderForm() {
    this.form = document.createElement("form");

    const courseOptions = this.courses.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    const teacherOptions = this.teachers.map(t => `<option value="${t.name}">${t.name}</option>`).join('');
    const classroomOptions = this.classrooms.map(r => `<option value="${r.name}">${r.name}</option>`).join('');
    
    this.form.innerHTML = `
        <h2>${getText("addToSchedule")}</h2>
        <select id="daySelect" required>
          <option value="">${getText("selectDay")}</option>
          <option>${getText("monday")}</option>
          <option>${getText("tuesday")}</option>
          <option>${getText("wednesday")}</option>
          <option>${getText("thursday")}</option>
          <option>${getText("friday")}</option>
        </select>
        <input type="time" id="hourInput" required />
        <select id="courseSelect" required>
        <option value="">${getText("selectCourse")}</option>
        ${courseOptions}
      </select>
      <select id="teacherSelect" required>
        <option value="">${getText("selectTeacher")}</option>
        ${teacherOptions}
      </select>
       <select id="classroomSelect" required>
        <option value="">${getText("selectClassroom")}</option>
        ${classroomOptions}
      </select>
      <button type="submit">${getText("add")}</button>
        <hr/>
      `;

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addScheduleItem();
    });

    this.container.appendChild(this.form);
  }

  renderTable() {
    this.table = document.createElement("table");
    this.table.innerHTML = `
        <thead>
          <tr>
            <th>${getText("day")}</th>
            <th>${getText("time")}</th>
            <th>${getText("course")}</th>
            <th>${getText("teacher")}</th>
            <th>${getText("classroom")}</th>
            <th>${getText("delete")}</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
    this.container.appendChild(this.table);
    this.updateTable();
  }

  addScheduleItem() {
    const day = this.form.querySelector("#daySelect").value;
    const hour = this.form.querySelector("#hourInput").value;
    const course = this.form.querySelector("#courseSelect").value.trim();
    const teacher = this.form.querySelector("#teacherSelect").value.trim();
    const classroom = this.form.querySelector('#classroomSelect').value;
    if (!courseSelect) {
      console.error(`${getText("courseSelectFieldWarning")}`);
      return;
    }
  

    if (!day || !hour || !course || !teacher|| !classroom) return;

    this.schedule.push({ day, hour, course, teacher,classroom });
    this.saveToStorage();
    this.form.reset();
    this.updateTable();
  }

  updateTable() {
    const tbody = this.table.querySelector("tbody");
    tbody.innerHTML = "";

    this.schedule.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${item.day}</td>
          <td>${item.hour}</td>
          <td>${item.course}</td>
          <td>${item.teacher}</td>
          <td>${item.classroom}</td>
          <td><button data-index="${index}">${getText("delete")}</button></td>
        `;
      tbody.appendChild(row);
    });

    this.table.querySelectorAll("button[data-index]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        this.deleteScheduleItem(index);
      });
    });
  }

  deleteScheduleItem(index) {
    this.schedule.splice(index, 1);
    this.saveToStorage(); 
    this.updateTable();
  }
}
