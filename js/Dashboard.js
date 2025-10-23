import ToDoWidget from './ToDoWidget.js';
import QuoteWidget from './QuoteWidget.js';
import MoodTrackerWidget from './MoodTrackerWidget.js';
import TimerWidget from './TimerWidget.js';
import InspirationWidget from './InspirationWidget.js';


export default class Dashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.widgets = [];
    this._setupDragAndDrop();
  }

  _setupDragAndDrop() {
    let dragged = null;
    this.container.addEventListener('dragstart', (e) => {
      dragged = e.target.closest('.widget');
      if (!dragged) return;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', dragged.id);
      setTimeout(() => dragged.style.opacity = '0.5', 0);
    });

    this.container.addEventListener('dragover', (e) => {
      e.preventDefault();
      const target = e.target.closest('.widget');
      if (!target || target === dragged) return;
      const bounding = target.getBoundingClientRect();
      const offset = bounding.y + bounding.height / 2;
      if (e.clientY - offset > 0) {
        target.style['border-bottom'] = '3px solid #2980b9';
        target.style['border-top'] = '';
      } else {
        target.style['border-top'] = '3px solid #2980b9';
        target.style['border-bottom'] = '';
      }
    });

    this.container.addEventListener('dragleave', (e) => {
      const target = e.target.closest('.widget');
      if (target) {
        target.style['border-top'] = '';
        target.style['border-bottom'] = '';
      }
    });

    this.container.addEventListener('drop', (e) => {
      e.preventDefault();
      const target = e.target.closest('.widget');
      if (!target || target === dragged) return;

      const draggedIndex = this.widgets.findIndex(w => w.id === dragged.id);
      const targetIndex = this.widgets.findIndex(w => w.id === target.id);

      target.style['border-top'] = '';
      target.style['border-bottom'] = '';
      dragged.style.opacity = '';

      if (e.clientY > target.getBoundingClientRect().top + target.offsetHeight / 2) {
        this.container.insertBefore(dragged, target.nextSibling);
        this.widgets.splice(targetIndex + 1, 0, this.widgets.splice(draggedIndex, 1)[0]);
      } else {
        this.container.insertBefore(dragged, target);
        this.widgets.splice(targetIndex, 0, this.widgets.splice(draggedIndex, 1)[0]);
      }
    });
  }

  addWidget(type) {
    const id = `widget-${Date.now()}`;
    let widget;
    const removeHandler = () => this.removeWidget(id);

    switch(type) {
      case 'todo':
        widget = new ToDoWidget({ title: 'Мой список дел', id, onRemove: removeHandler });
        break;
      case 'quote':
        widget = new QuoteWidget({ title: 'Цитата', id, onRemove: removeHandler });
        break;
      case 'mood':
        widget = new MoodTrackerWidget({ title: 'Трекер настроения', id, onRemove: removeHandler });
        break;
	  case 'timer':
		widget = new TimerWidget({ title: 'Таймер', id, onRemove: removeHandler });
		break;
	  case 'inspiration':
		widget = new InspirationWidget({ title: 'Космическое вдохновение', id, onRemove: removeHandler });
		break;
      default:
        return;
    }

    this.widgets.push({ id, widget });
    const widgetElement = widget.render();
    widgetElement.id = id;
    widgetElement.classList.add('widget');
    widgetElement.setAttribute('draggable', 'true');
    this.container.appendChild(widgetElement);
  }

  removeWidget(widgetId) {
    const index = this.widgets.findIndex(w => w.id === widgetId);
    if (index !== -1) {
      this.widgets[index].widget.destroy();
      const el = document.getElementById(widgetId);
      if (el) el.remove();
      this.widgets.splice(index, 1);
    }
  }
}