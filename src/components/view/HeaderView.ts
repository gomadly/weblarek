import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IHeaderView } from '../../types'

export class HeaderView extends Component<IHeaderView > {

  // Поля

  protected counterElement: HTMLElement;
  protected basketButton: HTMLElement;

  constructor(container: HTMLElement, private eventEmitter: IEvents) {

    super(container);

    this.counterElement = this.container.querySelector('.header__basket-counter') as HTMLElement;
    this.basketButton = this.container.querySelector('.header__basket') as HTMLElement;

    this.basketButton.addEventListener('click', () => {
      this.eventEmitter.emit('basket:open');
    })
  }

  // Сеттер

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}