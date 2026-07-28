import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class ModalView extends Component<unknown> {

  //Поля
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(container: HTMLElement, private eventEmitter: IEvents) {

    super(container);

    this.closeButton = this.container.querySelector('.modal__close') as HTMLButtonElement;
    this.contentElement = this.container.querySelector('.modal__content') as HTMLElement;

     this.closeButton.addEventListener('click', () => {
      this.eventEmitter.emit('modal:close');
    });

    this.container.addEventListener('click', (event: MouseEvent) => {
      if (event.target === this.container) {
        this.eventEmitter.emit('modal:close');
      }
    });
  }

  //Сеттер
  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  //Методы
  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.contentElement.replaceChildren(); 
  }
}