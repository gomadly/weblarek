import { BasicForm } from './BasicForm';
import { IEvents } from '../../base/Events';

export class OrderForm extends BasicForm<{ address: string, payment: string }> {
  // Поле
  protected paymentButtons: NodeListOf<HTMLButtonElement>;

  constructor(template: HTMLTemplateElement, eventEmitter: IEvents) {
    super(template, eventEmitter);

    this.submitButton = this.container.querySelector('.order__button') as HTMLButtonElement;

    this.paymentButtons = this.container.querySelectorAll('.button_alt');

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
        
        this.eventEmitter.emit('payment:change', {
          field: 'payment',
          value: button.name 
        });
      });
    });

    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.eventEmitter.emit('order:submit');
    });
  }

  // Сеттер
  set payment(value: string) {
    const button = this.container.querySelector(`[name="${value}"]`) as HTMLButtonElement;
    if (button) {
      this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
      button.classList.add('button_alt-active');
    }
  }
}