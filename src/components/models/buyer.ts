// components/Models/Buyer.ts
import { IBuyer, TPayment, ValidationErrors } from '../../types';
import { IEvents } from '../base/Events';


export class Buyer {
  private payment: TPayment | null = null;
  private email: string = '';
  private phone: string = '';
  private address: string = '';
  private eventBroker: IEvents; 

    constructor(eventBroker: IEvents) {
    this.eventBroker = eventBroker;
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.eventBroker.emit('buyer:changed'); 
  }

  setEmail(email: string): void {
    this.email = email;
    this.eventBroker.emit('buyer:changed'); 
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.eventBroker.emit('buyer:changed'); 
  }

  setAddress(address: string): void {
    this.address = address;
    this.eventBroker.emit('buyer:changed'); 
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
    this.eventBroker.emit('buyer:changed'); 
  }

  validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    if (!this.email) {
      errors.email = 'Укажите email';
    }
    if (!this.phone) {
      errors.phone = 'Укажите номер телефона';
    }
    if (!this.address) {
      errors.address = 'Укажите адрес доставки';
    }

    return errors;
  }
}

