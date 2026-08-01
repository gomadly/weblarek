import { Component } from '../base/Component';

export interface IGalleryView {
  items: HTMLElement[];
}

export class GalleryView extends Component<IGalleryView> {
   
  constructor(container: HTMLElement) {
    super(container);
  }

  // Сеттеры
  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}