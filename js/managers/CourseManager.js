import { getText } from "../utils.js";

export class CourseManager {
  constructor(container, teachers = []) {
    this.container = container;
    this.courses = this.loadFromStorage(); 
    this.teachers = teachers;
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
    const data = localStorage.getItem("courses");
    return data ? JSON.parse(data) : [];
  }

  saveToStorage() {
    localStorage.setItem("courses", JSON.stringify(this.courses));
  }

  renderForm() {
    this.form = document.createElement("form");
    this.form.innerHTML = `
        <h2>${getText("addCourse")}</h2>
        <input type="text" id="courseName" placeholder="${getText("courseName")}" required />
        <input type="text" id="courseCode" placeholder="${getText("courseCode")}" required />
        <select id="teacherSelect" required>
  <option value="">${getText("selectTeacher")}</option>
  ${this.teachers
    .map((t) => `<option value="${t.name}">${t.name}</option>`)
    .join("")}
</select>

        <button type="submit">${getText("add")}</button>
        <hr/>
      `;

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addCourse();
    });

    this.container.appendChild(this.form);
  }

  renderTable() {
    this.table = document.createElement("table");
    this.table.innerHTML = `
        <thead>
          <tr>
            <th>${getText("course")}</th>
            <th>${getText("code")}</th>
            <th>${getText("teacher")}</th>
            <th>${getText("delete")}</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
    this.container.appendChild(this.table);
    this.updateTable();
  }

  updateTable() {
    const tbody = this.table.querySelector("tbody");
    tbody.innerHTML = "";

    this.courses.forEach((course, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${course.name}</td>
          <td>${course.code}</td>
          <td>${course.teacher}</td>
          <td><button data-index="${index}">${getText("delete")}</button></td>
        `;
      tbody.appendChild(row);
    });

    this.table.querySelectorAll("button[data-index]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        this.deleteCourse(index);
      });
    });
  }

  addCourse() {
    const name = this.form.querySelector("#courseName").value.trim();
    const code = this.form.querySelector("#courseCode").value.trim();
    const teacher = this.form.querySelector("#teacherSelect").value;

    if (!name || !code || !teacher) return;

    this.courses.push({ name, code, teacher });
    this.saveToStorage(); 
    this.form.reset();
    this.updateTable();
  }

  deleteCourse(index) {
    this.courses.splice(index, 1);
    this.saveToStorage(); 
    this.updateTable();
  }
}
