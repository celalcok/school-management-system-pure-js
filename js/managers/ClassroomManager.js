import { getText } from "../utils.js";

export class ClassroomManager {
    constructor(container) {
      this.container = container;
      this.classrooms = this.loadFromStorage(); 
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
      const data = localStorage.getItem('classrooms');
      return data ? JSON.parse(data) : [];
    }
  
    saveToStorage() {
      localStorage.setItem('classrooms', JSON.stringify(this.classrooms));
    }
  
    renderForm() {
      this.form = document.createElement('form');
      this.form.innerHTML = `
        <h2>${getText("addClassroom")}</h2>
        <input type="text" id="classroomName" placeholder="${getText("classroomName")}" required />
        <input type="number" id="capacity" placeholder="${getText("capacity")}" required min="1" />
        <button type="submit">${getText("add")}</button>
        <hr/>
      `;
  
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addClassroom();
      });
  
      this.container.appendChild(this.form);
    }
  
    renderTable() {
      this.table = document.createElement('table');
      this.table.innerHTML = `
        <thead>
          <tr>
            <th>${getText("classroom")}</th>
            <th>${getText("capacity")}</th>
            <th>${getText("delete")}</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      this.container.appendChild(this.table);
      this.updateTable();
    }
  
    addClassroom() {
      const name = this.form.querySelector('#classroomName').value.trim();
      const capacity = parseInt(this.form.querySelector('#capacity').value);
  
      if (!name || isNaN(capacity) || capacity <= 0) return;
  
      this.classrooms.push({ name, capacity });
      this.saveToStorage();
      this.form.reset();
      this.updateTable();
    }
  
    updateTable() {
      const tbody = this.table.querySelector('tbody');
      tbody.innerHTML = '';
  
      this.classrooms.forEach((room, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${room.name}</td>
          <td>${room.capacity}</td>
          <td><button data-index="${index}">${getText("delete")}</button></td>
        `;
        tbody.appendChild(row);
      });
  
      this.table.querySelectorAll('button[data-index]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const index = e.target.dataset.index;
          this.deleteClassroom(index);
        });
      });
    }
  
    deleteClassroom(index) {
      this.classrooms.splice(index, 1);
      this.saveToStorage(); 
      this.updateTable();
    }
  }
  