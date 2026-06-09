import { IApi } from '../../../types/index';
import type { ProductsResponse, OrderRequest, OrderConfirmation } from '../../../types/index';

export class ProductApiService {
  constructor(private api: IApi) {}

  async getProducts(): Promise<ProductsResponse> {
    return await this.api.get('/product/');
  }

  async createOrder(orderData: OrderRequest): Promise<OrderConfirmation> {
    return await this.api.post('/order/', orderData);
  }
}
