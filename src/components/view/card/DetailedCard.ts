import { Card } from './Card';
import { IEvents } from '../../base/Events';
import { categoryMap } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';
import { IDetailedCard } from '../../../types'; 

export class DetailedCard extends Card<IDetailedCard> {
  // Поля
  protected descriptionElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected actionButton: HTMLButtonElement;
  
  private eventEmitter: IEvents;

  constructor(container: HTMLElement, eventEmitter: IEvents) {
    super(container); 
    
    this.eventEmitter = eventEmitter;

    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.actionButton.addEventListener('click', () => {
      this.eventEmitter.emit('card:action'); 
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