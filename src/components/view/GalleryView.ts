import { Component } from '../base/Component';


export class GalleryView extends Component<{ items: HTMLElement[] }> {
  
  constructor(container: HTMLElement) {
    super(container);
  }

  // Сеттеры
  
  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}