import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class Products {
  private items: IProduct[] = [];
  private selectedProduct: IProduct | null = null;
  private _events: IEvents;

  constructor(events: IEvents) {
    this._events = events;
  }

  setItems(items: IProduct[]) {
    this.items = items;
    this._events.emit('products:changed');
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getProductById(id: string): IProduct | null {
    const product = this.items.find(item => item.id === id);
    return product || null;
  }

  setSelectedProduct(product: IProduct) {
    this.selectedProduct = product;
    this._events.emit('product:changed');
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}