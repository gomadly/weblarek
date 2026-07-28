import './scss/styles.scss';

// ==========================================
// 1. ИМПОРТЫ
// ==========================================
import { API_URL } from './utils/constants'; 
import { EventEmitter } from './components/base/Events'; 
import { Api } from './components/base/Api';
import { ApiService } from './components/ProductApiService';

import { Products } from './components/models/productCatalog';
import { Cart } from './components/models/cart';
import { Buyer } from './components/models/buyer';

import { GalleryView } from './components/view/GalleryView';
import { CatalogCard } from './components/view/card/CatalogCard';

import { ModalView } from './components/view/ModalView';
import { DetailedCard } from './components/view/card/DetailedCard';

import { HeaderView } from './components/view/HeaderView';
import { BasketView } from './components/view/BasketView'; 
import { BasketCard } from './components/view/card/BasketCard';

import { OrderForm } from './components/view/form/OrderForm';
import { ContactsForm } from './components/view/form/ContactsForm';
import { SuccessView } from './components/view/SuccessView';

// ==========================================
// 2. ИНИЦИАЛИЗАЦИЯ ЯДРА (MVP)
// ==========================================
const eventEmitter = new EventEmitter();

const productsModel = new Products(eventEmitter);
const cartModel = new Cart(eventEmitter);
const buyerModel = new Buyer();

const apiInstance = new Api(API_URL);
const apiService = new ApiService(apiInstance);

const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const galleryView = new GalleryView(galleryContainer);

const modalContainer = document.querySelector('.modal') as HTMLElement;
const modalView = new ModalView(modalContainer, eventEmitter);

const headerContainer = document.querySelector('.header') as HTMLElement;
const headerView = new HeaderView(headerContainer, eventEmitter);

// ==========================================
// 3. ПЕРЕМЕННЫЕ ДЛЯ ВАЛИДАЦИИ ФОРМ
// ==========================================
let currentOrderData: { payment: string, address: string } = { payment: '', address: '' };
let activeOrderForm: OrderForm | null = null;

let currentContactsData: { email: string, phone: string } = { email: '', phone: '' };
let activeContactsForm: ContactsForm | null = null;

// ==========================================
// 4. ФУНКЦИИ ВАЛИДАЦИИ
// ==========================================
function validateOrderForm() {
  if (!activeOrderForm) return;

  const isAddressValid = currentOrderData.address.trim().length >= 2;
  const isPaymentValid = currentOrderData.payment === 'card' || currentOrderData.payment === 'cash';

  if (isAddressValid && isPaymentValid) {
    activeOrderForm.valid = true;
    activeOrderForm.errors = '';
  } else {
    activeOrderForm.valid = false;
    if (!isPaymentValid && currentOrderData.address.length > 0) {
      activeOrderForm.errors = 'Выберите способ оплаты';
    } else if (!isAddressValid && currentOrderData.address.length > 0) {
      activeOrderForm.errors = 'Адрес должен быть длиннее 2 символов';
    } else {
      activeOrderForm.errors = '';
    }
  }
}

function validateContactsForm() {
  if (!activeContactsForm) return;

  const isEmailValid = /\S+@\S+\.\S+/.test(currentContactsData.email);
  const phoneDigits = currentContactsData.phone.replace(/\D/g, '');
  const isPhoneValid = phoneDigits.length >= 10;

  if (isEmailValid && isPhoneValid) {
    activeContactsForm.valid = true;
    activeContactsForm.errors = '';
  } else {
    activeContactsForm.valid = false;
    if (currentContactsData.email.length > 0 || currentContactsData.phone.length > 0) {
      if (!isEmailValid && currentContactsData.email.length > 0) {
        activeContactsForm.errors = 'Неверный формат Email';
      } else if (!isPhoneValid && currentContactsData.phone.length > 0) {
        activeContactsForm.errors = 'Телефон должен содержать минимум 10 цифр';
      }
    } else {
      activeContactsForm.errors = '';
    }
  }
}

// ==========================================
// 5. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================
function openBasket() {
  const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
  const basketView = new BasketView(basketTemplate, eventEmitter);
  
  const basketItemsElements = cartModel.getItems().map((product, index) => {
    const itemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
    const basketCard = new BasketCard(itemTemplate, eventEmitter, product.id, index + 1);
    
    basketCard.title = product.title;
    basketCard.price = product.price;
    
    return basketCard.render();
  });

  basketView.items = basketItemsElements;
  basketView.total = cartModel.getTotalPrice();
  
  modalView.content = basketView.render();
  modalView.open();
}

// ==========================================
// 6. ЛОГИКА ПРЕЗЕНТЕРА (ОБРАБОТЧИКИ СОБЫТИЙ)
// ==========================================

eventEmitter.on('products:changed', () => {
  const items = productsModel.getItems();
  const cards = items.map(product => {
    const template = document.querySelector('#card-catalog') as HTMLTemplateElement; 
    const card = new CatalogCard(template, eventEmitter, product.id);
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = product.image;
    return card.render(); 
  });
  galleryView.items = cards;
});

eventEmitter.on('card:select', (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product) {
    const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
    const detailedCard = new DetailedCard(previewTemplate, eventEmitter, product.id);
    
    detailedCard.title = product.title;
    detailedCard.price = product.price;
    detailedCard.category = product.category;
    detailedCard.description = product.description;
    detailedCard.image = product.image;
    
    modalView.content = detailedCard.render();
    modalView.open();
  }
});

eventEmitter.on('modal:close', () => {
  modalView.close();
});

eventEmitter.on('card:add', (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product) {
    cartModel.addItem(product);
    modalView.close();
  }
});

eventEmitter.on('basket:changed', () => {
  headerView.counter = cartModel.getItemCount();
});

eventEmitter.on('basket:open', () => {
  openBasket();
});

eventEmitter.on('basket:remove', (data: { id: string }) => {
  cartModel.removeItem(data.id);
  openBasket();
});

eventEmitter.on('basket:order', () => {
  currentOrderData = { payment: '', address: '' };
  const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
  activeOrderForm = new OrderForm(orderTemplate, eventEmitter);
  
  modalView.content = activeOrderForm.render();
  modalView.open();
  validateOrderForm();
});

eventEmitter.on('order:submit', () => {
  if (activeOrderForm && activeOrderForm.valid) {
    currentContactsData = { email: '', phone: '' };
    const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
    activeContactsForm = new ContactsForm(contactsTemplate, eventEmitter);
    
    modalView.content = activeContactsForm.render();
    modalView.open();
    validateContactsForm();
  }
});

eventEmitter.on('address:change', (data: { field: string, value: string }) => {
  currentOrderData.address = data.value;
  validateOrderForm();
});

eventEmitter.on('payment:change', (data: { field: string, value: string }) => {
  currentOrderData.payment = data.value;
  validateOrderForm();
});

eventEmitter.on('email:change', (data: { field: string, value: string }) => {
  currentContactsData.email = data.value;
  validateContactsForm();
});

eventEmitter.on('phone:change', (data: { field: string, value: string }) => {
  currentContactsData.phone = data.value;
  validateContactsForm();
});

eventEmitter.on('contacts:submit', () => {
  if (activeContactsForm && activeContactsForm.valid) {
    const total = cartModel.getTotalPrice();
    cartModel.clear();
    
    const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
    const successView = new SuccessView(successTemplate, eventEmitter);
    successView.description = `Списано ${total} синапсов`;
    
    modalView.content = successView.render();
    modalView.open();
  }
});

eventEmitter.on('success:close', () => {
  modalView.close();
});

// ==========================================
// 7. ЗАПУСК ПРИЛОЖЕНИЯ
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