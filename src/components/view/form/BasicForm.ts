import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';

export class BasicForm<T extends Record<string, string>> extends Component<T> {
  // Поля
  protected submitButton: HTMLButtonElement | null;
  protected errorsElement: HTMLElement | null;
  protected eventEmitter: IEvents;
  
  protected _valid: boolean = false;

  constructor(template: HTMLTemplateElement, eventEmitter: IEvents) {
    super(template.content.firstElementChild!.cloneNode(true) as HTMLElement);
    
    this.eventEmitter = eventEmitter;

    this.submitButton = this.container.querySelector('.button') as HTMLButtonElement;
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

  get valid(): boolean {
    return this._valid;
  }

  set valid(value: boolean) {
    this._valid = value;
    if (this.submitButton) {
      this.submitButton.disabled = !value;
    }
  }

  set values(values: Partial<T>) {
    Object.entries(values).forEach(([key, val]) => {
      const input = this.container.querySelector(`[name="${key}"]`) as HTMLInputElement;
      if (input) input.value = val;
    });
  }
}