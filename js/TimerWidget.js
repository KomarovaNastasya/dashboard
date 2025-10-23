import UIComponent from './UIComponent.js';

export default class TimerWidget extends UIComponent {
  constructor(config) {
    super(config);
    this.title = config.title || 'Таймер';
    this.onRemove = config.onRemove;
    this.isRunning = false;
    this.timeLeft = 25 * 60;
    this.initialTime = 25 * 60;
    this.intervalId = null;
    this.presets = [
      { name: 'Помодоро', time: 25 * 60 },
      { name: 'Короткий', time: 5 * 60 },
      { name: 'Длинный', time: 45 * 60 }
    ];
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget-card timer-widget';
    this.element.style.position = 'relative';

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.className = 'widget-remove-btn';
    removeBtn.title = 'Удалить виджет';
    removeBtn.addEventListener('click', () => this.onRemove && this.onRemove());
    this.element.appendChild(removeBtn);

    const titleEl = document.createElement('h3');
    titleEl.textContent = this.title;
    this.element.appendChild(titleEl);

    // Таймер
    this.timerDisplay = document.createElement('div');
    this.timerDisplay.className = 'timer-display';
    this.updateDisplay();
    this.element.appendChild(this.timerDisplay);

    // Элементы управления
    const controls = document.createElement('div');
    controls.className = 'timer-controls';

    this.startPauseBtn = document.createElement('button');
    this.startPauseBtn.textContent = 'Старт';
    this.startPauseBtn.className = 'timer-btn start-btn';
    this.startPauseBtn.addEventListener('click', () => this.toggleTimer());

    this.resetBtn = document.createElement('button');
    this.resetBtn.textContent = 'Сброс';
    this.resetBtn.className = 'timer-btn reset-btn';
    this.resetBtn.addEventListener('click', () => this.resetTimer());

    controls.appendChild(this.startPauseBtn);
    controls.appendChild(this.resetBtn);
    this.element.appendChild(controls);

    // Пресеты
    const presetsContainer = document.createElement('div');
    presetsContainer.className = 'timer-presets';
    
    const presetsTitle = document.createElement('h4');
    presetsTitle.textContent = 'Быстрые настройки:';
    presetsContainer.appendChild(presetsTitle);

    const presetsButtons = document.createElement('div');
    presetsButtons.className = 'presets-buttons';
    
    this.presets.forEach(preset => {
      const btn = document.createElement('button');
      btn.textContent = preset.name;
      btn.className = 'preset-btn';
      btn.addEventListener('click', () => this.setTime(preset.time));
      presetsButtons.appendChild(btn);
    });
    
    presetsContainer.appendChild(presetsButtons);
    this.element.appendChild(presetsContainer);

    // Кастомный ввод времени
    const customInput = document.createElement('div');
    customInput.className = 'timer-custom-input';
    
    const inputLabel = document.createElement('label');
    inputLabel.textContent = 'Своё время (минуты):';
    customInput.appendChild(inputLabel);

    this.minutesInput = document.createElement('input');
    this.minutesInput.type = 'number';
    this.minutesInput.min = '1';
    this.minutesInput.max = '120';
    this.minutesInput.value = '25';
    this.minutesInput.className = 'minutes-input';
    customInput.appendChild(this.minutesInput);

    const setCustomBtn = document.createElement('button');
    setCustomBtn.textContent = 'Установить';
    setCustomBtn.className = 'set-custom-btn';
    setCustomBtn.addEventListener('click', () => this.setCustomTime());
    customInput.appendChild(setCustomBtn);

    this.element.appendChild(customInput);

    return this.element;
  }

  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    if (this.timeLeft <= 0) return;
    
    this.isRunning = true;
    this.startPauseBtn.textContent = 'Пауза';
    this.startPauseBtn.classList.add('pause-btn');
    
    this.intervalId = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();
      
      if (this.timeLeft <= 0) {
        this.timerComplete();
      }
    }, 1000);
  }

  pauseTimer() {
    this.isRunning = false;
    this.startPauseBtn.textContent = 'Старт';
    this.startPauseBtn.classList.remove('pause-btn');
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resetTimer() {
    this.pauseTimer();
    this.timeLeft = this.initialTime;
    this.updateDisplay();
  }

  setTime(seconds) {
    this.pauseTimer();
    this.timeLeft = seconds;
    this.initialTime = seconds;
    this.updateDisplay();
  }

  setCustomTime() {
    const minutes = parseInt(this.minutesInput.value);
    if (minutes > 0 && minutes <= 120) {
      this.setTime(minutes * 60);
    }
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (this.timeLeft < 60 && this.timeLeft > 0) {
      this.timerDisplay.classList.add('warning');
    } else {
      this.timerDisplay.classList.remove('warning');
    }
  }

  timerComplete() {
    this.pauseTimer();
    this.timerDisplay.textContent = '00:00';
    this.timerDisplay.classList.add('complete');
    
    if (Notification.permission === 'granted') {
      new Notification('Таймер завершен!', {
        body: 'Время вышло!',
        icon: '/favicon.ico'
      });
    }
    
    let blinkCount = 0;
    const blinkInterval = setInterval(() => {
      this.timerDisplay.classList.toggle('complete');
      blinkCount++;
      if (blinkCount >= 6) {
        clearInterval(blinkInterval);
        this.timerDisplay.classList.add('complete');
      }
    }, 500);
  }

  destroy() {
    this.pauseTimer();
    if (this.element) {
      this.element.remove();
    }
  }
}