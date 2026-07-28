export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type ValidationErrors = Partial<Record<keyof IBuyer, string>>;

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

// интерфейс для товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// интерфейс для данных покупателя
export interface IBuyer {
  payment:  TPayment | null;
  email: string;
  phone: string;
  address: string;
}

// 1. Тип ответа сервера с массивом товаров
export interface ProductsResponse {
  items: IProduct[]; // предполагаем, что сервер возвращает массив в поле items
  total: number; 
}

// 2. Тип данных, отправляемых при создании заказа
export interface OrderRequest {
  payment: TPayment;
  email: string;  
  phone: string;
  address: string;

  items: string[];
  total: number;
}

// 3. Тип подтверждения успешного заказа от сервера
export interface OrderConfirmation {
  id: string;
  total: number;
}
