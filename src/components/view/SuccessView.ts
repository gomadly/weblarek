import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class SuccessView extends Component<unknown> {
  // Поля
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, private eventEmitter: IEvents) {
    super(template.content.firstElementChild!.cloneNode(true) as HTMLElement);

    this.descriptionElement = this.container.querySelector('.order-success__description') as HTMLElement;
    this.closeButton = this.container.querySelector('.order-success__close') as HTMLButtonElement;

    this.closeButton.addEventListener('click', () => {
      this.eventEmitter.emit('success:close');
    });
  }

  // Сеттер
  set description(value: string) {
    this.descriptionElement.textContent = value;
  }
}