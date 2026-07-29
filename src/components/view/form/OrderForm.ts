import { BasicForm } from './BasicForm';
import { IEvents } from '../../base/Events';
import { IOrderFormState } from '../../../types';

export class OrderForm extends BasicForm<IOrderFormState> {
  // Поля

  protected addressElement: HTMLInputElement;
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;

  constructor(container: HTMLElement, eventEmitter: IEvents) {
    super(container, eventEmitter);

    this.addressElement = this.container.querySelector('[name="address"]') as HTMLInputElement;
    this.cardButton = this.container.querySelector('[name="card"]') as HTMLButtonElement;
    this.cashButton = this.container.querySelector('[name="cash"]') as HTMLButtonElement;

    this.cardButton.addEventListener('click', () => {
      this.cardButton.classList.add('button_alt-active');
      this.cashButton.classList.remove('button_alt-active');
      this.eventEmitter.emit('payment:change', { field: 'payment', value: 'card' });
    });

    this.cashButton.addEventListener('click', () => {
      this.cashButton.classList.add('button_alt-active');
      this.cardButton.classList.remove('button_alt-active');
      this.eventEmitter.emit('payment:change', { field: 'payment', value: 'cash' });
    });

    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.eventEmitter.emit('order:submit');
    });
  }

  // Сеттеры
  
  set address(value: string) {
    this.addressElement.value = value;
  }

  set payment(value: string) {
    this.cardButton.classList.remove('button_alt-active');
    this.cashButton.classList.remove('button_alt-active');
    
    if (value === 'card') {
      this.cardButton.classList.add('button_alt-active');
    } else if (value === 'cash') {
      this.cashButton.classList.add('button_alt-active');
    }
  }
}