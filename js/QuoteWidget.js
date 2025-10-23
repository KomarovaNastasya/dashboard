import UIComponent from './UIComponent.js';

export default class QuoteWidget extends UIComponent {
  constructor(config) {
    super(config);
    this.title = config.title || 'Цитата';
    this.onRemove = config.onRemove;
  }

  async fetchQuote() {
    try {
      const response = await fetch('https://api.quotable.io/random');
      if (!response.ok) throw new Error('Ошибка сети');
      const data = await response.json();
      return {
        text: data.content,
        author: data.author
      };
    } catch (err) {
      // Fallback quotes
      const fallbackQuotes = [
		  { text: "Великие дела нужно совершать, а не обдумывать бесконечно."},
		  { text: "Единственный способ сделать что-то очень хорошо — любить то, что ты делаешь."},
		  { text: "Ваше время ограничено, не тратьте его, живя чужой жизнью."},
		  { text: "Сложнее всего начать действовать, все остальное зависит только от упорства."},
		  { text: "Лучшая месть — огромный успех."},
		  { text: "Не откладывай на завтра то, что можно сделать послезавтра."},
		  { text: "Если тебе плюют в спину — значит ты впереди."},
		  { text: "Победа — это еще не все, все — это постоянное желание побеждать."},
		  { text: "Либо напиши что-то стоящее, либо делай что-то, о чем стоит написать."},
		  { text: "Я не потерпел неудачу. Я просто нашел 10 000 способов, которые не работают."},
		  { text: "Счастье — это не что-то готовое. Оно приходит от ваших собственных действий."},
		  { text: "Жизнь — это то, что происходит с тобой, пока ты строишь другие планы."},
		  { text: "За двумя зайцами погонишься — ни одного не поймаешь."},
		  { text: "Век живи — век учись."},
		  { text: "Мы сами должны стать теми переменами, которые хотим увидеть в мире."},
		  { text: "Всегда выбирайте самый трудный путь — на нем вы не встретите конкурентов."},
		  { text: "Единственная настоящая ошибка — не исправлять своих прошлых ошибок."},
		  { text: "Упади семь раз и восемь раз поднимись."},
		  { text: "Лучше зажечь одну маленькую свечу, чем проклинать темноту."},
		  { text: "Преждевременная оптимизация — корень всех зол."},
		  { text: "Лучше сделать и пожалеть, чем не сделать и пожалеть вдвойне."},
		  { text: "Любая достаточно развитая технология неотличима от магии."},
		  { text: "Работает? Не трогай!"},
		  { text: "Ошибка — это не провал, а возможность научиться чему-то новому."},
		  { text: "Инновации отличают лидера от догоняющего."},
		  { text: "Успех — это способность идти от неудачи к неудаче, не теряя энтузиазма."},
		  { text: "Будущее принадлежит тем, кто верит в красоту своей мечты."},
		  { text: "Если проблему можно решить за деньги, то это не проблема — это расходы."},
		  { text: "Оптимист верит, что мы живем в лучшем из миров. Пессимист боится, что так оно и есть."},
		  { text: "Завтра — самый загруженный день недели."}
      ];
      return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    }
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget-card quote-widget';
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

    const quoteContainer = document.createElement('div');
    quoteContainer.className = 'quote-container';
    
    this.quoteText = document.createElement('p');
    this.quoteText.className = 'quote-text';
    this.quoteAuthor = document.createElement('p');
    this.quoteAuthor.className = 'quote-author';

    quoteContainer.appendChild(this.quoteText);
    quoteContainer.appendChild(this.quoteAuthor);
    this.element.appendChild(quoteContainer);

    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = 'Новая цитата';
    refreshBtn.className = 'refresh-btn';
    refreshBtn.addEventListener('click', () => this.updateQuote());
    this.element.appendChild(refreshBtn);

    this.updateQuote();

    return this.element;
  }

  async updateQuote() {
    this.quoteText.textContent = 'Загрузка...';
    this.quoteAuthor.textContent = '';
    const quote = await this.fetchQuote();
    this.quoteText.textContent = `"${quote.text}"`;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }

}
