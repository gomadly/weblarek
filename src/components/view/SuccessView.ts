import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ISuccessView } from '../../types';

export class SuccessView extends Component<ISuccessView> {
  // Поля
  
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, private eventEmitter: IEvents) {
    super(container);

    this.descriptionElement = this.container.querySelector('.order-success__description') as HTMLElement;
    this.closeButton = this.container.querySelector('.order-success__close') as HTMLButtonElement;

    this.closeButton.addEventListener('click', () => {
      this.eventEmitter.emit('success:close');
    });
  }

  // Сеттеры

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }
}