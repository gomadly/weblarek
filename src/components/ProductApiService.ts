import type { IApi, IProduct, ProductsResponse, OrderRequest, OrderConfirmation } from '../types/index';

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Метод для получения списка товаров с сервера
  async fetchProducts(): Promise<ProductsResponse> {
    return await this.api.get<ProductsResponse>('/product/');
  }

  // Метод для отправки данных заказа на сервер
  async sendOrder(orderData: OrderRequest): Promise<OrderConfirmation> {
    return await this.api.post<OrderConfirmation>('/order/', orderData);
  }
}