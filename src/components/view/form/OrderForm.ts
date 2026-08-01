import { BasicForm } from './BasicForm'; 
import { IEvents } from '../../base/Events'; 
import { IOrderFormState, TPayment } from '../../../types'; 
import { ensureElement } from '../../../utils/utils';

export class OrderForm extends BasicForm<IOrderFormState> { 
  //Поля
  protected addressElement: HTMLInputElement; 
  protected cardButton: HTMLButtonElement; 
  protected cashButton: HTMLButtonElement;

  constructor(container: HTMLElement, eventEmitter: IEvents) { 
    super(container, eventEmitter); 
    
    this.addressElement = ensureElement<HTMLInputElement>('[name="address"]', this.container); 
    this.cardButton = ensureElement<HTMLButtonElement>('[name="card"]', this.container); 
    this.cashButton = ensureElement<HTMLButtonElement>('[name="cash"]', this.container);

    this.cardButton.addEventListener('click', () => { 
      this.eventEmitter.emit('payment:change', { value: 'card' }); 
    });

    this.cashButton.addEventListener('click', () => { 
      this.eventEmitter.emit('payment:change', { value: 'cash' }); 
    });

    this.container.addEventListener('submit', (event: Event) => { 
      event.preventDefault(); 
      this.eventEmitter.emit('order:submit'); 
    }); 
  }

  //Сеттеры
  set address(value: string) { 
    this.addressElement.value = value; 
  }

  set payment(value: TPayment | null) { 
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }
}