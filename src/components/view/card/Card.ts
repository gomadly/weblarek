import { Component } from "../../base/Component";
import { ICard } from '../../../types';
import { ensureElement } from '../../../utils/utils';

export class Card<T extends ICard> extends Component<T> {
  // Поля
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement('.card__title', this.container);
    this.priceElement = ensureElement('.card__price', this.container);
  }

  // Сеттеры
  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    if (value === null || value === 0) {
      this.priceElement.textContent = 'Бесценно';
    } else {
      this.priceElement.textContent = `${value} синапсов`;
    }
  }
}
