import { Card } from './Card';
import { IEvents } from '../../base/Events';

export class CatalogCard extends Card {
  constructor(template: HTMLTemplateElement, eventEmitter: IEvents, private productId: string) {
    super(template, eventEmitter);

    this.container.addEventListener('click', () => {
      this.eventEmitter.emit('card:select', { id: this.productId });
    });
  }
}