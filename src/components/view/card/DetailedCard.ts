import { Card } from './Card';
import { IEvents } from '../../base/Events';

export class DetailedCard extends Card {
  // Поле
  protected descriptionElement: HTMLElement;

  constructor(template:HTMLTemplateElement, eventEmitter: IEvents, private productId: string) {
    
    super(template, eventEmitter)

    this.descriptionElement = this.container.querySelector('.card__text') as HTMLElement;

    // В конструкторе DetailedCard, после super(...):
  if (this.actionButton) {
    this.actionButton.addEventListener('click', () => {
      this.eventEmitter.emit('card:add', { id: this.productId });
      });
    }
  }

  // Сеттер
  set description(value: string) {
    this.descriptionElement.textContent = value;
  }
}