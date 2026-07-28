import { Card } from './Card';
import { IEvents } from '../../base/Events';

export class BasketCard extends Card {
  // Поля
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, eventEmitter: IEvents, private productId: string, index: number) {
    super(template, eventEmitter);

    this.indexElement = this.container.querySelector('.basket__item-index') as HTMLElement;
    this.deleteButton = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;

    this.index = index;

    this.deleteButton.addEventListener('click', () => {
      this.eventEmitter.emit('basket:remove', { id: this.productId });
    });
  }

  // Сеттер
  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}