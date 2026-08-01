import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import { IFormState } from '../../../types';
import { ensureElement } from '../../../utils/utils';

export class BasicForm<T extends IFormState> extends Component<T> {
  // Поля
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement; 
  protected eventEmitter: IEvents;

  constructor(container: HTMLElement, eventEmitter: IEvents) {
    super(container);
    
    this.eventEmitter = eventEmitter;

    this.submitButton = ensureElement<HTMLButtonElement>('.modal__actions .button', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.name) {
        this.eventEmitter.emit(`${target.name}:change`, {
          value: target.value
        });
      }
    });
  }

  // Сеттеры
  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }
}