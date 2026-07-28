import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class BasketView extends Component<unknown> {
  // Поля
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected orderButton: HTMLButtonElement | null;

  constructor(template: HTMLTemplateElement, private eventEmitter: IEvents) {
    super(template.content.cloneNode(true) as HTMLElement);

    this.listElement = this.container.querySelector('.basket__list') as HTMLElement;
    this.totalElement = this.container.querySelector('.basket__price') as HTMLElement;
    this.orderButton = this.container.querySelector('.basket__button') as HTMLButtonElement;

    if (this.orderButton) {
      this.orderButton.addEventListener('click', () => {
        this.eventEmitter.emit('basket:order');
      });
    }
  }

  // Сеттеры
  set items(items: HTMLElement[]) {
    if (this.listElement) {
      if (items.length > 0) {
        this.listElement.replaceChildren(...items);
        if (this.orderButton) this.orderButton.disabled = false;
      } else {
        this.listElement.replaceChildren();
        if (this.orderButton) this.orderButton.disabled = true;
      }
    }
  }

  set total(value: number) {
    if (this.totalElement) {
      this.totalElement.textContent = `${value} синапсов`;
    }
  }
}