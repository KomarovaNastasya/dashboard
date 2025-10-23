import Dashboard from './Dashboard.js';

const dashboard = new Dashboard('dashboard-container');

document.getElementById('add-todo-btn').addEventListener('click', () => {
  dashboard.addWidget('todo');
});

document.getElementById('add-quote-btn').addEventListener('click', () => {
  dashboard.addWidget('quote');
});

document.getElementById('add-mood-btn').addEventListener('click', () => {
  dashboard.addWidget('mood');
});

document.getElementById('add-timer-btn').addEventListener('click', () => {
  dashboard.addWidget('timer');
});

document.getElementById('add-inspiration-btn').addEventListener('click', () => {
  dashboard.addWidget('inspiration');
});