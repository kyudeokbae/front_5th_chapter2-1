import { ELEMENT_ID } from '../consts';
import { getState } from '../store';

export const updateProductSelect = () => {
  const productSelectElement = document.getElementById(
    ELEMENT_ID.PRODUCT_SELECT
  );
  productSelectElement.innerHTML = '';

  const products = getState('products');
  products.forEach((product) => {
    const selectOption = document.createElement('option');
    selectOption.value = product.id;
    selectOption.textContent = product.name + ' - ' + product.price + '원';
    selectOption.disabled = product.quantity === 0;

    productSelectElement.appendChild(selectOption);
  });
};
