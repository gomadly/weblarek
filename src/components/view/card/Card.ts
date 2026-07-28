import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { categoryMap, CDN_URL } from "../../../utils/constants";

export class Card extends Component<unknown> {
  // Поля
  protected titleElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected actionButton: HTMLButtonElement | null;

  constructor (template: HTMLTemplateElement, protected eventEmitter: IEvents) {

    super(template.content.firstElementChild!.cloneNode(true) as HTMLElement);

    this.titleElement = this.container.querySelector('.card__title') as HTMLElement;
    this.imageElement = this.container.querySelector('.card__image') as HTMLImageElement; 
    this.categoryElement = this.container.querySelector('.card__category') as HTMLElement;
    this.priceElement = this.container.querySelector('.card__price') as HTMLElement;

    this.actionButton = this.container.querySelector('.card__button') as HTMLButtonElement | null;
  }

  // Сеттеры
  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set image(value: string) {
    this.imageElement.src = CDN_URL + value;
    this.imageElement.alt = this.titleElement.textContent || 'Изображение товара';
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    
    this.categoryElement.className = 'card__category';
    
    const categoryClass = categoryMap[value as keyof typeof categoryMap];
    
    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceElement.textContent = 'Недоступно';
      
      if (this.actionButton) {
        this.actionButton.disabled = true;
      }
    } else {
      this.priceElement.textContent = `${value} синапсов`;
      
      if (this.actionButton) {
        this.actionButton.disabled = false;
      }
    }
  }

  set actionText(value: string) {
    if (this.actionButton) {
      this.actionButton.textContent = value;
    }
  }
}