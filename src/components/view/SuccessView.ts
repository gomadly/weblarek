import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ISuccessView } from '../../types';
import { ensureElement } from '../../utils/utils';

export class SuccessView extends Component<ISuccessView> {
  // Поля
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, private eventEmitter: IEvents) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.closeButton.addEventListener('click', () => {
      this.eventEmitter.emit('success:close');
    });
  }

  // Сеттеры
  set description(value: string) {
    this.descriptionElement.textContent = value;
  }
}