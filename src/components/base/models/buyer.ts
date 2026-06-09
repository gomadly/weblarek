// components/Models/Buyer.ts
import { IBuyer, TPayment } from '../../../types';

export class Buyer {
  private payment: TPayment = 'cash';
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  setPayment(payment: TPayment): void {
    this.payment = payment;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setAddress(address: string): void {
    this.address = address;
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
    this.payment = 'cash' as TPayment;
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validate(): { [key in keyof IBuyer]?: string } {
    const errors: { [key: string]: string } = {};

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

