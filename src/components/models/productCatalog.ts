import { IProduct } from '../../../types';

export class Products {
  private items: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  setItems(items: IProduct[]) {
    this.items = items;
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
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
