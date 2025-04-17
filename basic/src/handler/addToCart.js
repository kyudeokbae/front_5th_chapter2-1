import { ELEMENT_ID } from '../consts';
import { updateCartTotals } from '../model';
import { dispatch, getState } from '../store';

function updateExistingCartItem(itemElement, product) {
  const quantitySpan = itemElement.querySelector('span');
  const currentQuantity = parseInt(quantitySpan.textContent.split('x ')[1]);
  const newQuantity = currentQuantity + 1;

  if (newQuantity <= product.quantity + currentQuantity) {
    quantitySpan.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
    product.quantity--;
  } else {
    alert('재고가 부족합니다.');
  }
}

function addNewCartItem(product) {
  const cartElement = document.getElementById(ELEMENT_ID.CART);
  const newItem = document.createElement('div');

  newItem.id = product.id;
  newItem.className = 'flex justify-between items-center mb-2';

  newItem.innerHTML = `
    <span>${product.name} - ${product.price}원 x 1</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
              data-product-id="${product.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
              data-product-id="${product.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
              data-product-id="${product.id}">삭제</button>
    </div>
  `;

  cartElement.appendChild(newItem);
  product.quantity--;
}

export const addToCartClickHandler = () => {
  const selectedProductId = document.getElementById(
    ELEMENT_ID.PRODUCT_SELECT
  ).value;
  const products = getState('products');
  const productToAdd = products.find(
    (product) => product.id === selectedProductId
  );

  if (!productToAdd || productToAdd.quantity <= 0) {
    return;
  }

  const existingItem = document.getElementById(productToAdd.id);

  if (existingItem) {
    updateExistingCartItem(existingItem, productToAdd);
  } else {
    addNewCartItem(productToAdd);
  }

  updateCartTotals();
  dispatch('updateLastSelectedProductId', selectedProductId);
};
