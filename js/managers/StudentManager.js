import { getText } from "../utils.js";

export class StudentManager {
    constructor(container) {
      this.container = container;
      this.students = this.loadFromStorage();
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
      const data = localStorage.getItem('students');
      return data ? JSON.parse(data) : [];
    }
  
    saveToStorage() {
      localStorage.setItem('students', JSON.stringify(this.students));
    }
  
    renderForm() {
      this.form = document.createElement('form');
      this.form.innerHTML = `
        <h2>${getText("addStudent")}</h2>
        <input type="text" id="studentName" placeholder="${getText("fullName")}" required />
        <input type="text" id="studentNumber" placeholder="${getText("studentId")}" required />
        <button type="submit">${getText("add")}</button>
        <hr/>
      `;
  
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addStudent();
      });
  
      this.container.appendChild(this.form);
    }
  
    renderTable() {
      this.table = document.createElement('table');
      this.table.innerHTML = `
        <thead>
          <tr>
            <th>${getText("fullName")}</th>
            <th>${getText("studentId")}</th>
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
  
      this.students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${student.name}</td>
          <td>${student.number}</td>
          <td><button data-index="${index}">${getText("delete")}</button></td>
        `;
        tbody.appendChild(row);
      });
  
      this.table.querySelectorAll('button[data-index]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const index = e.target.dataset.index;
          this.deleteStudent(index);
        });
      });
    }
  
    addStudent() {
      const name = this.form.querySelector('#studentName').value.trim();
      const number = this.form.querySelector('#studentNumber').value.trim();
  
      if (!name || !number) return;
  
      this.students.push({ name, number });
      this.saveToStorage();
      this.form.reset();
      this.updateTable();
    }
  
    deleteStudent(index) {
      this.students.splice(index, 1);
      this.saveToStorage();
      this.updateTable();
    }
  }
  