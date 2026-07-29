import { Card } from './Card';
import { IEvents } from '../../base/Events';
import { categoryMap } from '../../../utils/constants';

export class DetailedCard extends Card {
  // Поля
  
  protected descriptionElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected actionButton: HTMLButtonElement;


  constructor(container: HTMLElement, eventEmitter: IEvents, private productId: string) {
    
    super(container, eventEmitter)

    this.descriptionElement = this.container.querySelector('.card__text') as HTMLElement;
    this.imageElement = this.container.querySelector('.card__image') as HTMLImageElement;
    this.categoryElement = this.container.querySelector('.card__category') as HTMLElement;
    this.actionButton = this.container.querySelector('.card__button') as HTMLButtonElement;
    this.descriptionElement = this.container.querySelector('.card__text') as HTMLElement;

   this.actionButton.addEventListener('click', () => {
      this.eventEmitter!.emit('card:add', { id: this.productId });
    });
  }

  // Сеттеры

  set image(value: string) {
    this.imageElement.src = value;
  }

  set alt(value: string) {
    this.imageElement.alt = value;
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    
    Array.from(this.categoryElement.classList).forEach(className => {
      if (className.startsWith("card__category_")) {
        this.categoryElement.classList.remove(className);
      }
    });

    const categoryClass = categoryMap[value as keyof typeof categoryMap];
    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.actionButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.actionButton.disabled = value;
  }
}