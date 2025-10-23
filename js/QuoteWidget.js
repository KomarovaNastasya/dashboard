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
		  { text: "Великие дела нужно совершать, а не обдумывать бесконечно.", author: "Юлий Цезарь" },
		  { text: "Единственный способ сделать что-то очень хорошо — любить то, что ты делаешь.", author: "Стив Джобс" },
		  { text: "Ваше время ограничено, не тратьте его, живя чужой жизнью.", author: "Стив Джобс" },
		  { text: "Сложнее всего начать действовать, все остальное зависит только от упорства.", author: "Амелия Эрхарт" },
		  { text: "Лучшая месть — огромный успех.", author: "Фрэнк Синатра" },
		  { text: "Не откладывай на завтра то, что можно сделать послезавтра.", author: "Марк Твен" },
		  { text: "Если тебе плюют в спину — значит ты впереди.", author: "Федор Достоевский" },
		  { text: "Победа — это еще не все, все — это постоянное желание побеждать.", author: "Винс Ломбарди" },
		  { text: "Либо напиши что-то стоящее, либо делай что-то, о чем стоит написать.", author: "Бенджамин Франклин" },
		  { text: "Я не потерпел неудачу. Я просто нашел 10 000 способов, которые не работают.", author: "Томас Эдисон" },
		  { text: "Счастье — это не что-то готовое. Оно приходит от ваших собственных действий.", author: "Далай-лама XIV" },
		  { text: "Жизнь — это то, что происходит с тобой, пока ты строишь другие планы.", author: "Джон Леннон" },
		  { text: "За двумя зайцами погонишься — ни одного не поймаешь.", author: "Русская народная пословица" },
		  { text: "Век живи — век учись.", author: "Луций Анней Сенека" },
		  { text: "Мы сами должны стать теми переменами, которые хотим увидеть в мире.", author: "Махатма Ганди" },
		  { text: "Всегда выбирайте самый трудный путь — на нем вы не встретите конкурентов.", author: "Шарль де Голль" },
		  { text: "Единственная настоящая ошибка — не исправлять своих прошлых ошибок.", author: "Конфуций" },
		  { text: "Упади семь раз и восемь раз поднимись.", author: "Японская пословица" },
		  { text: "Лучше зажечь одну маленькую свечу, чем проклинать темноту.", author: "Конфуций" },
		  { text: "Преждевременная оптимизация — корень всех зол.", author: "Дональд Кнут" },
		  { text: "Лучше сделать и пожалеть, чем не сделать и пожалеть вдвойне.", author: "Народная мудрость" },
		  { text: "Любая достаточно развитая технология неотличима от магии.", author: "Артур Кларк" },
		  { text: "Работает? Не трогай!", author: "Золотое правило программиста" },
		  { text: "Ошибка — это не провал, а возможность научиться чему-то новому.", author: "Неизвестный" },
		  { text: "Инновации отличают лидера от догоняющего.", author: "Стив Джобс" },
		  { text: "Успех — это способность идти от неудачи к неудаче, не теряя энтузиазма.", author: "Уинстон Черчилль" },
		  { text: "Будущее принадлежит тем, кто верит в красоту своей мечты.", author: "Элеонора Рузвельт" },
		  { text: "Если проблему можно решить за деньги, то это не проблема — это расходы.", author: "Генри Форд" },
		  { text: "Оптимист верит, что мы живем в лучшем из миров. Пессимист боится, что так оно и есть.", author: "Джеймс Брэнч Кэбелл" },
		  { text: "Завтра — самый загруженный день недели.", author: "Испанская пословица" }
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
    this.quoteAuthor.textContent = `— ${quote.author}`;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}