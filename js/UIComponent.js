export default class UIComponent {
  constructor({ title, id }) {
    if (new.target === UIComponent) {
      throw new TypeError("Cannot instantiate abstract class UIComponent directly");
    }
    this.title = title;
    this.id = id;
    this.element = null;
  }

  render() {
    const wrapper = document.createElement('div');
    return wrapper;
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
