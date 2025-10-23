import UIComponent from './UIComponent.js';

export default class MoodTrackerWidget extends UIComponent {
  constructor(config) {
    super(config);
    this.moods = ['😃 Отлично', '🙂 Хорошо', '😐 Нормально', '☹️ Плохо', '😢 Очень плохо'];
    this.entries = {};
	this.onRemove = config.onRemove;
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'mood-widget';
	
	const removeBtn = document.createElement('button');
	removeBtn.textContent = '×';
	removeBtn.className = 'widget-remove-btn';
	removeBtn.title = 'Удалить виджет';
	removeBtn.addEventListener('click', () => {
		if (this.onRemove) this.onRemove();
	});
	this.element.appendChild(removeBtn);

    const titleEl = document.createElement('h3');
    titleEl.textContent = this.title;
    this.element.appendChild(titleEl);

    this.moodList = document.createElement('div');
    this.moodList.className = 'mood-list';

    this.moods.forEach((mood) => {
      const btn = document.createElement('button');
      btn.textContent = mood;
      btn.className = 'mood-btn';
      btn.addEventListener('click', () => this.saveMood(mood, btn));
      this.moodList.appendChild(btn);
    });

    this.element.appendChild(this.moodList);

    this.historyContainer = document.createElement('div');
    this.historyContainer.className = 'mood-history';
    this.element.appendChild(this.historyContainer);

    this.renderHistory();
    return this.element;
  }

  saveMood(mood, btn) {
    const today = new Date().toISOString().split('T')[0];
    this.entries[today] = mood;
    this.updateSelection(btn);
    this.renderHistory();
  }

  updateSelection(selectedBtn) {
    Array.from(this.moodList.children).forEach(btn => btn.classList.remove('selected'));
    selectedBtn.classList.add('selected');
  }

  renderHistory() {
    this.historyContainer.innerHTML = '<h4>Записи по дням:</h4>';
    if (Object.keys(this.entries).length === 0) {
      this.historyContainer.innerHTML += '<p>Пока нет записей</p>';
      return;
    }
    const list = document.createElement('ul');
    for (const [date, mood] of Object.entries(this.entries)) {
      const li = document.createElement('li');
      li.textContent = `${date}: ${mood}`;
      list.appendChild(li);
    }
    this.historyContainer.appendChild(list);
  }

  destroy() {
    super.destroy();
    this.entries = {};
  }
}
