// ========================================== 
// 1. БАЗОВЫЕ ТИПЫ И API 
// ========================================== 

// Допустимые HTTP-методы для отправки данных на сервер 
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'; 

// Тип для ошибок валидации: ключи совпадают с полями IBuyer, значения — текст ошибки 
export type ValidationErrors = Partial<Record<keyof IBuyer, string>>; 

// Базовый интерфейс клиента для работы с API (методы GET и POST) 
export interface IApi { 
    get<T extends object>(uri: string): Promise<T>; 
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>; 
} 

// Допустимые способы оплаты 
export type TPayment = 'card' | 'cash' | null;


// ========================================== 
// 2. МОДЕЛИ ДАННЫХ (Данные с сервера и для отправки) 
// ========================================== 

// Интерфейс для товара (данные, приходящие с сервера) 
export interface IProduct { 
  id: string; 
  description: string; 
  image: string; 
  title: string; 
  category: string; 
  price: number | null; 
} 

// Интерфейс для данных покупателя (состояние модели Buyer) 
export interface IBuyer { 
  payment: TPayment; 
  email: string; 
  phone: string; 
  address: string; 
} 

// Тип ответа сервера при запросе списка товаров 
export interface ProductsResponse { 
  items: IProduct[]; // Массив товаров 
  total: number;     // Общее количество товаров на сервере 
} 

// Тип данных, отправляемых на сервер при создании заказа 
export interface OrderRequest { 
  payment: TPayment; 
  email: string;   
  phone: string; 
  address: string; 
  items: string[]; // Массив ID заказываемых товаров 
  total: number;   // Общая сумма заказа 
} 

// Тип подтверждения успешного заказа от сервера 
export interface OrderConfirmation { 
  id: string;    // ID созданного заказа 
  total: number; // Итоговая сумма, подтвержденная сервером 
} 


// ========================================== 
// 3. СОСТОЯНИЯ ПРЕДСТАВЛЕНИЙ (VIEW) 
// ========================================== 

// Базовое состояние карточки (общие поля для всех типов карточек) 
export interface ICard { 
  title: string; 
  price: number | null; 
} 

export interface ICatalogCard extends ICard { 
  image: string; 
  alt: string; 
  category: string; 
} 

export interface IDetailedCard extends ICatalogCard { 
  description: string; 
  buttonText: string; 
  buttonDisabled: boolean; 
} 

// Состояние карточки товара внутри корзины 
export interface IBasketCard extends ICard { 
  index: number; // Порядковый номер товара в списке корзины 
} 

export interface IBasketView { 
  items: HTMLElement[]; 
  total: number; 
  buttonDisabled: boolean; 
} 

// Состояние шапки сайта (счетчик товаров в корзине) 
export interface IHeaderView { 
  counter: number; 
} 

// Состояние модального окна (его текущий контент) 
export interface IModalView { 
  content: HTMLElement; 
} 

// Состояние экрана успешного оформления заказа 
export interface ISuccessView { 
  description: string; 
} 


// ========================================== 
// 4. СОСТОЯНИЯ ФОРМ 
// ========================================== 

// Базовое состояние любой формы (признак валидности и текст ошибки) 
export interface IFormState { 
  valid: boolean; 
  errors: string; 
} 

export interface IOrderFormState extends IFormState { 
  address: string; 
  payment: TPayment | null; 
} 

// Состояние формы контактных данных (расширяет базовую форму полями email и телефона) 
export interface IContactsFormState extends IFormState { 
  email: string; 
  phone: string; 
}