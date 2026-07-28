import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class Cart {
  private items: IProduct[] = [];
  private _events: IEvents;

  constructor(events: IEvents) {
    this._events = events;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this._events.emit('basket:changed');
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
    this._events.emit('basket:changed');
  }

  clear(): void {
    this.items = [];
    this._events.emit('basket:changed');
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getItemCount(): number {
    return this.items.length;
  }

  hasItem(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }
}