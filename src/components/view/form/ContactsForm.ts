import { BasicForm } from './BasicForm'; 
import { IEvents } from '../../base/Events'; 
import { IContactsFormState } from '../../../types'; 
import { ensureElement } from '../../../utils/utils'; 

export class ContactsForm extends BasicForm<IContactsFormState> { 
  // Поля 
  protected emailElement: HTMLInputElement; 
  protected phoneElement: HTMLInputElement; 

  constructor(container: HTMLElement, eventEmitter: IEvents) { 
    super(container, eventEmitter); 

    this.emailElement = ensureElement<HTMLInputElement>('[name="email"]', this.container); 
    this.phoneElement = ensureElement<HTMLInputElement>('[name="phone"]', this.container); 

    this.container.addEventListener('submit', (event: Event) => { 
      event.preventDefault(); 
      this.eventEmitter.emit('contacts:submit'); 
    }); 
  } 

  // Сеттеры 
  set email(value: string) { 
    this.emailElement.value = value; 
  } 

  set phone(value: string) { 
    this.phoneElement.value = value; 
  } 
}