import UIComponent from './UIComponent.js';

export default class InspirationWidget extends UIComponent {
  constructor(config) {
    super(config);
    this.title = config.title || 'Космическое вдохновение';
    this.onRemove = config.onRemove;
  }

  async fetchInspiration() {
    try {
      // NASA Astronomy Picture of the Day API
      const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
      if (!response.ok) throw new Error('Ошибка сети');
      const data = await response.json();
      
      return {
        title: data.title,
        explanation: data.explanation,
        imageUrl: data.url,
        date: data.date
      };
    } catch (err) {
      console.log('Ошибка NASA API:', err);
      // Fallback данные
      const fallbackInspirations = [
        {
          title: "Красота Вселенной",
          explanation: "Каждый день NASA публикует удивительные фотографии космоса, напоминающие нам о бесконечной красоте и масштабах Вселенной. Эти изображения вдохновляют на новые открытия и напоминают, что нет пределов человеческому любопытству.",
          imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&h=300&fit=crop",
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Земля из космоса",
          explanation: "Вид на нашу планету из космоса напоминает о хрупкости и единстве всего человечества. Эта перспектива вдохновляет на заботу о нашем общем доме и стремление к миру.",
          imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500&h=300&fit=crop",
          date: new Date().toISOString().split('T')[0]
        },
        {
          title: "Звездные скопления",
          explanation: "Миллиарды звезд в галактиках напоминают нам, что даже самые маленькие шаги могут привести к великим открытиям. Каждая звезда - это история, каждая галактика - целая вселенная возможностей.",
          imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&h=300&fit=crop",
          date: new Date().toISOString().split('T')[0]
        }
      ];
      return fallbackInspirations[Math.floor(Math.random() * fallbackInspirations.length)];
    }
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget-card inspiration-widget';
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

    this.imageContainer = document.createElement('div');
    this.imageContainer.className = 'inspiration-image-container';
    this.element.appendChild(this.imageContainer);

    this.titleElement = document.createElement('h4');
    this.titleElement.className = 'inspiration-title';
    this.element.appendChild(this.titleElement);

    this.explanationElement = document.createElement('p');
    this.explanationElement.className = 'inspiration-explanation';
    this.element.appendChild(this.explanationElement);

    this.dateElement = document.createElement('div');
    this.dateElement.className = 'inspiration-date';
    this.element.appendChild(this.dateElement);

    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = 'Новое вдохновение';
    refreshBtn.className = 'refresh-btn';
    refreshBtn.addEventListener('click', () => this.updateInspiration());
    this.element.appendChild(refreshBtn);

    this.updateInspiration();

    return this.element;
  }

  async updateInspiration() {
    this.titleElement.textContent = 'Загружаем...';
    this.explanationElement.textContent = '';
    this.dateElement.textContent = '';
    this.imageContainer.innerHTML = '<div class="loading-spinner">🌀</div>';

    const inspiration = await this.fetchInspiration();
    
    this.titleElement.textContent = inspiration.title;
    this.explanationElement.textContent = this.truncateText(inspiration.explanation, 200);
    this.dateElement.textContent = `Дата: ${inspiration.date}`;

    // Загружаем изображение
    const img = new Image();
    img.className = 'inspiration-image';
    img.alt = inspiration.title;
    img.onload = () => {
      this.imageContainer.innerHTML = '';
      this.imageContainer.appendChild(img);
    };
    img.onerror = () => {
      this.imageContainer.innerHTML = '<div class="image-error">Изображение недоступно</div>';
    };
    img.src = inspiration.imageUrl;
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}