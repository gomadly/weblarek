import { Card } from './Card';
import { IBasketCard } from '../../../types'; 
import { ensureElement } from '../../../utils/utils';

export class BasketCard extends Card<IBasketCard> {
  // Поля
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, private onRemove: () => void) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    this.deleteButton.addEventListener('click', this.onRemove);
  }

  // Сеттеры
  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}