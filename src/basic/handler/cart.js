import { updateCartTotals } from '../model';
import { getState } from '../store';

const handleQuantityChange = (productId, quantityChange) => {
  const products = getState('products');
  const targetProduct = products.find((product) => product.id === productId);
  const cartItemElement = document.getElementById(productId);
  const cartItemSummaryElement = cartItemElement.querySelector('span');
  const [cartItemPrice, cartItemQuantity] =
    cartItemSummaryElement.textContent.split('x ');
  const quantityInCart = parseInt(cartItemQuantity);
  const newQuantity = quantityInCart + quantityChange;

  if (
    newQuantity > 0 &&
    newQuantity <= targetProduct.quantity + quantityInCart
  ) {
    cartItemSummaryElement.textContent = cartItemPrice + 'x ' + newQuantity;
    targetProduct.quantity -= quantityChange;
  } else if (newQuantity <= 0) {
    cartItemElement.remove();
    targetProduct.quantity -= quantityChange;
  } else {
    alert('재고가 부족합니다.');
  }

  updateCartTotals();
};

const handleRemoveItem = (productId) => {
  const products = getState('products');
  const targetProduct = products.find((product) => product.id === productId);
  const cartItemElement = document.getElementById(productId);
  const quantityInCart = parseInt(
    cartItemElement.querySelector('span').textContent.split('x ')[1]
  );

  targetProduct.quantity += quantityInCart;
  cartItemElement.remove();
  updateCartTotals();
};

export const cartClickHandler = (event) => {
  const { target } = event;
  const isChangeQuantity = target.classList.contains('quantity-change');
  const isRemove = target.classList.contains('remove-item');

  if (!isChangeQuantity && !isRemove) return;

  const productId = target.dataset.productId;

  if (isChangeQuantity) {
    const quantityChange = parseInt(target.dataset.change);
    handleQuantityChange(productId, quantityChange);
  } else if (isRemove) {
    handleRemoveItem(productId);
  }
};
