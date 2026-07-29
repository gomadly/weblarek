import { Card } from './Card';

export class BasketCard extends Card {
  // Поля

  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, private onRemove: () => void) {
    super(container);

    this.indexElement = this.container.querySelector('.basket__item-index') as HTMLElement;
    this.deleteButton = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;

    this.deleteButton.addEventListener('click', this.onRemove);
  }

  // Сеттеры
  
  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}