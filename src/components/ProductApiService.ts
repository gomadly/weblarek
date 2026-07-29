import type { IApi, ProductsResponse, OrderRequest, OrderConfirmation } from '../types/index';

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async fetchProducts(): Promise<ProductsResponse> {
    return await this.api.get<ProductsResponse>('/product/');
  }

  async sendOrder(orderData: OrderRequest): Promise<OrderConfirmation> {
    return await this.api.post<OrderConfirmation>('/order/', orderData);
  }
}