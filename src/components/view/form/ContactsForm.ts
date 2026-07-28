import { BasicForm } from './BasicForm';
import { IEvents } from '../../base/Events';

export class ContactsForm extends BasicForm<{ email: string, phone: string }> {
  constructor(template: HTMLTemplateElement, eventEmitter: IEvents) {
    super(template, eventEmitter);

    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.eventEmitter.emit('contacts:submit');
    });
  }
}