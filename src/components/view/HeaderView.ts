import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IHeaderView } from '../../types'
import { ensureElement } from '../../utils/utils'

export class HeaderView extends Component<IHeaderView > {

  // Поля
  protected counterElement: HTMLElement;
  protected basketButton: HTMLElement;

  constructor(container: HTMLElement, private eventEmitter: IEvents) {

    super(container);

    this.counterElement = ensureElement('.header__basket-counter', this.container);
    this.basketButton = ensureElement('.header__basket', this.container);

    this.basketButton.addEventListener('click', () => {
      this.eventEmitter.emit('basket:open');
    })
  }

  // Сеттер
  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}