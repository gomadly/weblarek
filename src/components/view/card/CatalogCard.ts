import { Card } from './Card';
import { categoryMap } from '../../../utils/constants';

export class CatalogCard extends Card {
  // Поля

  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, private onSelect: () => void) {
    super(container);

    this.container.addEventListener('click', this.onSelect);

    this.imageElement = this.container.querySelector('.card__image') as HTMLImageElement;
    this.categoryElement = this.container.querySelector('.card__category') as HTMLElement;
  }

  //Сеттеры

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
}