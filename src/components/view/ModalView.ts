import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IModalView } from '../../types'; // Добавил точку с запятой для аккуратности
import { ensureElement } from '../../utils/utils';

export class ModalView extends Component<IModalView> {
  // Поля
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(container: HTMLElement, private eventEmitter: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);

    this.closeButton.addEventListener('click', () => {
      this.eventEmitter.emit('modal:close');
    });

    this.container.addEventListener('click', (event: MouseEvent) => {
      if (event.target === this.container) {
        this.eventEmitter.emit('modal:close');
      }
    });
  }

  // Сеттеры
  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  // Методы
  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.contentElement.replaceChildren(); 
  }
}