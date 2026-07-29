import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import { IFormState } from '../../../types';

export class BasicForm<T extends IFormState> extends Component<T> {
  // Поля

  protected submitButton: HTMLButtonElement | null;
  protected errorsElement: HTMLElement | null;
  protected eventEmitter: IEvents;

  constructor(container: HTMLElement, eventEmitter: IEvents) {
    super(container);
    
    this.eventEmitter = eventEmitter;

    this.submitButton = this.container.querySelector('.modal__actions .button') as HTMLButtonElement;
    this.errorsElement = this.container.querySelector('.form__errors') as HTMLElement;

    this.container.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.name) {
        this.eventEmitter.emit(`${target.name}:change`, {
          field: target.name,
          value: target.value
        });
      }
    });
  }

  // Сеттеры
  
  set errors(value: string) {
    if (this.errorsElement) {
      this.errorsElement.textContent = value;
    }
  }

  set valid(value: boolean) {
    if (this.submitButton) {
      this.submitButton.disabled = !value;
    }
  }
}