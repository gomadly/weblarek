import { Card } from './Card';
import { categoryMap } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';
import { ICatalogCard } from '../../../types'; 

export class CatalogCard extends Card<ICatalogCard> {
  // Поля
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, private onSelect: () => void) {
    super(container);

    this.container.addEventListener('click', this.onSelect);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
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
}