import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { ICard } from '../../../types';

export class Card extends Component<ICard> {
  // Поля

  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor (container: HTMLElement, protected eventEmitter?: IEvents) {

    super(container);

    this.titleElement = this.container.querySelector('.card__title') as HTMLElement;
    this.priceElement = this.container.querySelector('.card__price') as HTMLElement;
  }

  // Сеттеры
  
  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = value !== null ? `${value} синапсов` : '';
  }
}