import UIComponent from './UIComponent.js';

export default class ToDoWidget extends UIComponent {
  constructor(config) {
    super(config);
    this.tasks = [];
    this.onRemove = config.onRemove;
    this.isEditing = false;
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'todo-widget widget-card';
    
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.className = 'widget-remove-btn';
    removeBtn.title = 'Удалить виджет';
    removeBtn.addEventListener('click', () => {
      if (this.onRemove) this.onRemove();
    });
    this.element.appendChild(removeBtn);

    this.titleContainer = document.createElement('div');
    this.titleContainer.className = 'todo-title-container';
    
    this.titleDisplay = document.createElement('h3');
    this.titleDisplay.textContent = this.title;
    this.titleDisplay.className = 'todo-title-display';
    this.titleDisplay.addEventListener('dblclick', () => this.startEditing());
    
    this.titleInput = document.createElement('input');
    this.titleInput.type = 'text';
    this.titleInput.value = this.title;
    this.titleInput.className = 'todo-title-input';
    this.titleInput.style.display = 'none';
    
    this.titleInput.addEventListener('blur', () => this.finishEditing());
    this.titleInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.finishEditing();
      }
    });

    this.titleContainer.appendChild(this.titleDisplay);
    this.titleContainer.appendChild(this.titleInput);
    this.element.appendChild(this.titleContainer);

    const inputContainer = document.createElement('div');
    inputContainer.className = 'todo-input-container';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Новая задача';
    input.className = 'task-input';
    this.input = input;
    inputContainer.appendChild(input);

	const addBtn = document.createElement('button');
	addBtn.textContent = '+';
	addBtn.className = 'add-task-btn';
	this.addBtn = addBtn;
	inputContainer.appendChild(addBtn);

    this.element.appendChild(inputContainer);

    const list = document.createElement('ul');
    this.list = list;
    this.list.className = 'tasks-list';
    this.element.appendChild(list);

    this._addEventListeners();

    return this.element;
  }

  startEditing() {
    if (this.isEditing) return;
    
    this.isEditing = true;
    this.titleDisplay.style.display = 'none';
    this.titleInput.style.display = 'block';
    this.titleInput.value = this.title;
    this.titleInput.focus();
    this.titleInput.select();
  }

  finishEditing() {
    if (!this.isEditing) return;
    
    this.isEditing = false;
    const newTitle = this.titleInput.value.trim();
    
    if (newTitle) {
      this.title = newTitle;
      this.titleDisplay.textContent = newTitle;
    }
    
    this.titleDisplay.style.display = 'block';
    this.titleInput.style.display = 'none';
  }

  _addEventListeners() {
    this.addBtn.addEventListener('click', () => {
      const taskText = this.input.value.trim();
      if (taskText) {
        this.addTask(taskText);
        this.input.value = '';
      }
    });

    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const taskText = this.input.value.trim();
        if (taskText) {
          this.addTask(taskText);
          this.input.value = '';
        }
      }
    });
  }

  addTask(taskText) {
    const li = document.createElement('li');
    li.className = 'task-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.addEventListener('change', () => {
      this.toggleTask(li, checkbox.checked);
    });

    const span = document.createElement('span');
    span.textContent = taskText;
    span.className = 'task-text';
    span.addEventListener('click', () => {
      const isCompleted = li.classList.contains('completed');
      this.toggleTask(li, !isCompleted);
      checkbox.checked = !isCompleted;
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Удалить';
    deleteBtn.className = 'task-delete-btn';
    deleteBtn.onclick = () => this.removeTask(li);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    this.list.appendChild(li);
    this.tasks.push({ 
      text: taskText, 
      element: li, 
      completed: false 
    });
  }

  toggleTask(li, completed) {
    if (completed) {
      li.classList.add('completed');
    } else {
      li.classList.remove('completed');
    }
    
    const taskIndex = this.tasks.findIndex(t => t.element === li);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].completed = completed;
    }
  }

  removeTask(li) {
    this.list.removeChild(li);
    this.tasks = this.tasks.filter(t => t.element !== li);
  }

  destroy() {
    super.destroy();
    this.tasks = [];
  }
}