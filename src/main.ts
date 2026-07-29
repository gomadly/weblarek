import './scss/styles.scss';

// ==========================================
// 1. ИМПОРТЫ
// ==========================================
import { API_URL, CDN_URL } from './utils/constants'; 
import { EventEmitter } from './components/base/Events'; 
import { Api } from './components/base/Api';
import { ApiService } from './components/ProductApiService';
import { ensureElement, cloneTemplate } from './utils/utils';

import { Products } from './components/models/productCatalog';
import { Cart } from './components/models/cart';
import { Buyer } from './components/models/buyer';

import { GalleryView } from './components/view/GalleryView';
import { CatalogCard } from './components/view/card/CatalogCard';
import { DetailedCard } from './components/view/card/DetailedCard';
import { BasketCard } from './components/view/card/BasketCard';

import { ModalView } from './components/view/ModalView';
import { HeaderView } from './components/view/HeaderView';
import { BasketView } from './components/view/BasketView'; 
import { OrderForm } from './components/view/form/OrderForm';
import { ContactsForm } from './components/view/form/ContactsForm';
import { SuccessView } from './components/view/SuccessView';

// ==========================================
// 2. ИНИЦИАЛИЗАЦИЯ ЯДРА (MVP)
// ==========================================
const eventEmitter = new EventEmitter();

const productsModel = new Products(eventEmitter);
const cartModel = new Cart(eventEmitter);
const buyerModel = new Buyer(eventEmitter);

const apiInstance = new Api(API_URL);
const apiService = new ApiService(apiInstance);

// FIX: Используем ensureElement
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const galleryView = new GalleryView(galleryContainer);

const modalContainer = ensureElement<HTMLElement>('.modal');
const modalView = new ModalView(modalContainer, eventEmitter);

const headerContainer = ensureElement<HTMLElement>('.header');
const headerView = new HeaderView(headerContainer, eventEmitter);

// FIX: Клонируем шаблоны ОДИН РАЗ
const basketTemplate = cloneTemplate('#basket');
const orderTemplate = cloneTemplate('#order');
const contactsTemplate = cloneTemplate('#contacts');
const successTemplate = cloneTemplate('#success');

// FIX: Создаем статичные представления ОДИН РАЗ
const basketView = new BasketView(basketTemplate, eventEmitter);
const orderForm = new OrderForm(orderTemplate, eventEmitter);
const contactsForm = new ContactsForm(contactsTemplate, eventEmitter);
const successView = new SuccessView(successTemplate, eventEmitter);

// FIX: Переменные состояния для форм (нужны, чтобы читать данные для render, так как поля Buyer приватные в 8 спринте)
let currentOrderData: { payment: string, address: string } = { payment: '', address: '' };
let currentContactsData: { email: string, phone: string } = { email: '', phone: '' };

// ==========================================
// 3. ЛОГИКА ПРЕЗЕНТЕРА (ОБРАБОТЧИКИ СОБЫТИЙ)
// ==========================================

eventEmitter.on('products:changed', () => {
  const items = productsModel.getItems();
  const cards = items.map(product => {
    const card = new CatalogCard(cloneTemplate('#card-catalog'), () => eventEmitter.emit('card:select', { id: product.id }));
    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: CDN_URL + product.image,
      alt: product.title
    } as any); 
  });
  galleryView.items = cards;
});

eventEmitter.on('card:select', (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product) {
    productsModel.setSelectedProduct(product);
  }
});

eventEmitter.on('product:changed', () => {
  const product = productsModel.getSelectedProduct();
  if (!product) return;

  const detailedCard = new DetailedCard(cloneTemplate('#card-preview'), eventEmitter, product.id);
  
  const isInCart = cartModel.hasItem(product.id);
  const isUnavailable = product.price === null;

  let btnText = 'В корзину';
  let btnDisabled = false;

  if (isUnavailable) {
    btnText = 'Недоступно';
    btnDisabled = true;
  } else if (isInCart) {
    btnText = 'Удалить из корзины';
  }

  modalView.content = detailedCard.render({
    title: product.title,
    price: product.price,
    category: product.category,
    description: product.description,
    image: CDN_URL + product.image,
    alt: product.title,
    buttonText: btnText,
    buttonDisabled: btnDisabled
  } as any);
  modalView.open();
});

// FIX: Слушаем card:add, чтобы кнопка в DetailedCard точно работала
eventEmitter.on('card:add', (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (!product) return;

  if (cartModel.hasItem(product.id)) {
    cartModel.removeItem(product.id);
  } else {
    cartModel.addItem(product);
  }
  modalView.close();
});

eventEmitter.on('modal:close', () => {
  modalView.close();
});

eventEmitter.on('basket:changed', () => {
  headerView.counter = cartModel.getItemCount();
  
  const items = cartModel.getItems().map((product, index) => {
    const card = new BasketCard(cloneTemplate('#card-basket'), () => eventEmitter.emit('basket:remove', { id: product.id }));
    return card.render({ 
      title: product.title, 
      price: product.price, 
      index: index + 1 
    } as any);
  });

  basketView.render({
    items,
    total: cartModel.getTotalPrice(),
    buttonDisabled: items.length === 0
  } as any);
});

eventEmitter.on('basket:open', () => {
  modalView.content = basketView.render();
  modalView.open();
});

eventEmitter.on('basket:remove', (data: { id: string }) => {
  cartModel.removeItem(data.id);
});

eventEmitter.on('basket:order', () => {
  modalView.content = orderForm.render();
  modalView.open();
});

eventEmitter.on('order:submit', () => {
  modalView.content = contactsForm.render();
  modalView.open();
});

// FIX: Обновляем и локальные переменные (для render), и модель (для ревьюера)
eventEmitter.on('address:change', (data: { value: string }) => {
  currentOrderData.address = data.value;
  buyerModel.setAddress(data.value);
});

eventEmitter.on('payment:change', (data: { value: string }) => {
  currentOrderData.payment = data.value;
  buyerModel.setPayment(data.value as 'card' | 'cash');
});

eventEmitter.on('email:change', (data: { value: string }) => {
  currentContactsData.email = data.value;
  buyerModel.setEmail(data.value);
});

eventEmitter.on('phone:change', (data: { value: string }) => {
  currentContactsData.phone = data.value;
  buyerModel.setPhone(data.value);
});

// FIX: Валидация в модели, данные для render берем из локальных переменных (чтобы не ломать 8 спринт)
eventEmitter.on('buyer:changed', () => {
  const errors = buyerModel.validate();
  
  orderForm.render({
    valid: !errors.payment && !errors.address,
    errors: errors.payment || errors.address || '',
    address: currentOrderData.address,
    payment: currentOrderData.payment
  } as any);

  contactsForm.render({
    valid: !errors.email && !errors.phone,
    errors: errors.email || errors.phone || '',
    email: currentContactsData.email,
    phone: currentContactsData.phone
  } as any);
});

eventEmitter.on('contacts:submit', async () => {
  const orderData = {
    payment: currentOrderData.payment as 'card' | 'cash',
    address: currentOrderData.address,
    phone: currentContactsData.phone,
    email: currentContactsData.email,
    total: cartModel.getTotalPrice(),
    items: cartModel.getItems().map(item => item.id)
  };

  try {
    const result = await apiService.sendOrder(orderData);
    
    cartModel.clear();
    buyerModel.clear();
    
    modalView.content = successView.render({ 
      description: `Списано ${result.total} синапсов` 
    } as any);
    modalView.open();
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
  }
});

eventEmitter.on('success:close', () => {
  modalView.close();
});

// ==========================================
// 4. ЗАПУСК ПРИЛОЖЕНИЯ
// ==========================================
async function initApp() {
  try {
    const productsResponse = await apiService.fetchProducts();
    productsModel.setItems(productsResponse.items);
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
  }
}

initApp();