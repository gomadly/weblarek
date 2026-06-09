export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// интерфейс для товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = 'card' | 'cash';

// интерфейс для данных покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// 1. Тип ответа сервера с массивом товаров
export interface ProductsResponse {
  items: IProduct[]; // предполагаем, что сервер возвращает массив в поле items
}

// 2. Тип данных, отправляемых при создании заказа
export interface OrderRequest {
  buyer: IBuyer;      // данные покупателя
  cart: IProduct[];   // выбранные товары (корзина)
}

// 3. Тип подтверждения успешного заказа от сервера
export interface OrderConfirmation {
  orderId: string;           // ID созданного заказа
  totalAmount: number;       // сумма заказа
  status: string;            // статус заказа (например, 'completed')
}
