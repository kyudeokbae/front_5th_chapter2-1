import { ELEMENT_ID } from '../consts';
import { addToCartClickHandler, cartClickHandler } from '../handler';
import { createElement } from '../lib';

const createCartHeader = () => {
  return createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });
};

const createCart = () => {
  return createElement('div', {
    id: ELEMENT_ID.CART,
    events: {
      click: cartClickHandler,
    },
  });
};

const createCartTotalSummary = () => {
  return createElement('div', {
    id: ELEMENT_ID.CART_TOTAL_SUMMARY,
    className: 'text-xl font-bold my-4',
  });
};

const createStockStatus = () => {
  return createElement('div', {
    id: ELEMENT_ID.STOCK_STATUS,
    className: 'text-sm text-gray-500 mt-2',
  });
};

const createProductSelect = () => {
  return createElement('select', {
    id: ELEMENT_ID.PRODUCT_SELECT,
    className: 'border rounded p-2 mr-2',
  });
};

const createAddToCartButton = () => {
  return createElement('button', {
    id: ELEMENT_ID.ADD_TO_CART,
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
    events: {
      click: addToCartClickHandler,
    },
  });
};

export const components = {
  $cartHeader: createCartHeader(),
  $cart: createCart(),
  $cartTotalSummary: createCartTotalSummary(),
  $stockStatus: createStockStatus(),
  $productSelect: createProductSelect(),
  $addToCartButton: createAddToCartButton(),
};
