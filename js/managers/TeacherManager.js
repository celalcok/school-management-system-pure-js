import { getText } from "../utils.js";

export class TeacherManager {
    constructor(container) {
      this.container = container;
      this.teachers = this.loadFromStorage();
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
      const data = localStorage.getItem('teachers');
      return data ? JSON.parse(data) : [];
    }
  
    saveToStorage() {
      localStorage.setItem('teachers', JSON.stringify(this.teachers));
    }
  
    renderForm() {
      this.form = document.createElement('form');
      this.form.innerHTML = `
        <h2>${getText("addTeacher")}</h2>
        <input type="text" id="teacherName" placeholder="${getText("fullName")}" required />
        <input type="text" id="branch" placeholder="${getText("subject")}" required />
        <button type="submit">${getText("add")}</button>
        <hr/>
      `;
  
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addTeacher();
      });
  
      this.container.appendChild(this.form);
    }
  
    renderTable() {
      this.table = document.createElement('table');
      this.table.innerHTML = `
        <thead>
          <tr>
            <th>${getText("fullName")}</th>
            <th>${getText("subjectTable")}</th>
            <th>${getText("delete")}</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      this.container.appendChild(this.table);
      this.updateTable();
    }
  
    updateTable() {
      const tbody = this.table.querySelector('tbody');
      tbody.innerHTML = '';
  
      this.teachers.forEach((teacher, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${teacher.name}</td>
          <td>${teacher.branch}</td>
          <td><button data-index="${index}">${getText("delete")}</button></td>
        `;
        tbody.appendChild(row);
      });
  
      this.table.querySelectorAll('button[data-index]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const index = e.target.dataset.index;
          this.deleteTeacher(index);
        });
      });
    }
  
    addTeacher() {
      const name = this.form.querySelector('#teacherName').value.trim();
      const branch = this.form.querySelector('#branch').value.trim();
  
      if (!name || !branch) return;
  
      this.teachers.push({ name, branch });
      this.saveToStorage(); 
      this.form.reset();
      this.updateTable();
    }
  
    deleteTeacher(index) {
      this.teachers.splice(index, 1);
      this.saveToStorage(); 
      this.updateTable();
    }
  }
  