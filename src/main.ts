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

const galleryContainer = ensureElement<HTMLElement>('.gallery');
const galleryView = new GalleryView(galleryContainer);

const modalContainer = ensureElement<HTMLElement>('.modal');
const modalView = new ModalView(modalContainer, eventEmitter);

const headerContainer = ensureElement<HTMLElement>('.header');
const headerView = new HeaderView(headerContainer, eventEmitter);

const basketTemplate = cloneTemplate('#basket');
const orderTemplate = cloneTemplate('#order');
const contactsTemplate = cloneTemplate('#contacts');
const successTemplate = cloneTemplate('#success');
const cardPreviewTemplate = cloneTemplate('#card-preview');

const basketView = new BasketView(basketTemplate, eventEmitter);
const orderForm = new OrderForm(orderTemplate, eventEmitter);
const contactsForm = new ContactsForm(contactsTemplate, eventEmitter);
const successView = new SuccessView(successTemplate, eventEmitter);
const detailedCard = new DetailedCard(cardPreviewTemplate, eventEmitter);

// ==========================================
// 3. ЛОГИКА ПРЕЗЕНТЕРА (ОБРАБОТЧИКИ СОБЫТИЙ)
// ==========================================

eventEmitter.on('products:changed', () => {
  const items = productsModel.getItems();
  const cards = items.map(product => {
    const card = new CatalogCard(cloneTemplate('#card-catalog'), () => {
      eventEmitter.emit('card:select', { id: product.id });
    });

    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: CDN_URL + product.image,
      alt: product.title
    });
  });

  galleryView.render({ items: cards });
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

  modalView.render({
    content: detailedCard.render({
      title: product.title,
      price: product.price,
      category: product.category,
      description: product.description,
      image: CDN_URL + product.image,
      alt: product.title,
      buttonText: btnText,
      buttonDisabled: btnDisabled
    })
  });

  modalView.open();
});

eventEmitter.on('card:action', () => {
  const product = productsModel.getSelectedProduct();
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
  headerView.render({ counter: cartModel.getItemCount() });

  const items = cartModel.getItems().map((product, index) => {
    const card = new BasketCard(cloneTemplate('#card-basket'), () => {
      eventEmitter.emit('basket:remove', { id: product.id });
    });

    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1
    });
  });

  basketView.render({
    items,
    total: cartModel.getTotalPrice(),
    buttonDisabled: items.length === 0
  });
});

eventEmitter.on('basket:open', () => {
  modalView.render({ content: basketView.render() });
  modalView.open();
});

eventEmitter.on('basket:remove', (data: { id: string }) => {
  cartModel.removeItem(data.id);
});

eventEmitter.on('basket:order', () => {
  modalView.render({ content: orderForm.render() });
  modalView.open();
});

eventEmitter.on('order:submit', () => {
  modalView.render({ content: contactsForm.render() });
  modalView.open();
});

eventEmitter.on('address:change', (data: { value: string }) => {
  buyerModel.setAddress(data.value);
});

eventEmitter.on('payment:change', (data: { value: string }) => {
  buyerModel.setPayment(data.value as 'card' | 'cash');
});

eventEmitter.on('email:change', (data: { value: string }) => {
  buyerModel.setEmail(data.value);
});

eventEmitter.on('phone:change', (data: { value: string }) => {
  buyerModel.setPhone(data.value);
});

eventEmitter.on('buyer:changed', () => {
  const buyer = buyerModel.getBuyerData();
  const errors = buyerModel.validate();

  const isInitialState = !buyer.payment && !buyer.address && !buyer.email && !buyer.phone;

  orderForm.render({
    valid: isInitialState ? false : (!errors.payment && !errors.address),
    errors: isInitialState ? '' : (errors.payment || errors.address || ''),
    address: buyer.address,
    payment: buyer.payment
  });

  contactsForm.render({
    valid: isInitialState ? false : (!errors.email && !errors.phone),
    errors: isInitialState ? '' : (errors.email || errors.phone || ''),
    email: buyer.email,
    phone: buyer.phone
  });
});

eventEmitter.on('contacts:submit', async () => {
  const buyer = buyerModel.getBuyerData();

  const orderData = {
    payment: buyer.payment,
    address: buyer.address,
    phone: buyer.phone,
    email: buyer.email,
    total: cartModel.getTotalPrice(),
    items: cartModel.getItems().map(item => item.id)
  };

  try {
    const result = await apiService.sendOrder(orderData);

    cartModel.clear();
    buyerModel.clear();

    modalView.render({
      content: successView.render({
        description: `Списано ${result.total} синапсов`
      })
    });
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
  cartModel.clear();
  buyerModel.clear();

  try {
    const productsResponse = await apiService.fetchProducts();
    productsModel.setItems(productsResponse.items);
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
  }
}

initApp();