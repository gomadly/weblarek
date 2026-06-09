import './scss/styles.scss';

import { apiProducts } from './utils/data';

import { Products } from './components/base/models/productCatalog';
import { Cart } from './components/base/models/cart';
import { Buyer } from './components/base/models/buyer'; 

// Создаём экземпляры классов
const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

// Тестируем класс Products
console.log('=== Тестирование класса Products ===');
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems());

const testProductId = apiProducts.items[0].id;
console.log(`Товар с ID ${testProductId}:`, productsModel.getProductById(testProductId));

productsModel.setSelectedProduct(apiProducts.items[1]);
console.log('Выбранный товар для просмотра:', productsModel.getSelectedProduct());

// Тестируем класс Cart
console.log('\n=== Тестирование класса Cart ===');
cartModel.addItem(apiProducts.items[2]);
cartModel.addItem(apiProducts.items[3]);
console.log('Товары в корзине:', cartModel.getItems());
console.log('Общая стоимость корзины:', cartModel.getTotalPrice());
console.log('Количество товаров в корзине:', cartModel.getItemCount());

console.log(`Корзина содержит товар с ID ${testProductId}:`, cartModel.hasItem(testProductId));
cartModel.removeItem(testProductId);
console.log('Товары в корзине после удаления:', cartModel.getItems());
cartModel.clear();
console.log('Корзина после очистки:', cartModel.getItems());

// Тестируем класс Buyer
console.log('\n=== Тестирование класса Buyer ===');
buyerModel.setEmail('test@example.com');
buyerModel.setPhone('+7 (123) 456-78-90');
buyerModel.setAddress('ул. Примерная, д. 1');
buyerModel.setPayment('card');

console.log('Данные покупателя:', buyerModel.getBuyerData());
console.log('Результаты валидации:', buyerModel.validate());

buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getBuyerData());
