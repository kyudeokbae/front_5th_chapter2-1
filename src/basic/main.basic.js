import { ELEMENT_ID } from './consts';
import { addToCartClickHandler, cartClickHandler } from './handler';
import { createElement } from './lib';
import {
  updateCartTotals,
  updateProductSelect,
  startFlashSalePromotion,
  startProductRecommendationPromotion,
} from './model';

const main = () => {
  const $cartText = createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });
  const $cart = createElement('div', {
    id: ELEMENT_ID.CART,
    events: {
      click: cartClickHandler,
    },
  });
  const $cartTotalSummary = createElement('div', {
    id: ELEMENT_ID.CART_TOTAL_SUMMARY,
    className: 'text-xl font-bold my-4',
  });
  const $stockStatus = createElement('div', {
    id: ELEMENT_ID.STOCK_STATUS,
    className: 'text-sm text-gray-500 mt-2',
  });
  const $productSelect = createElement('select', {
    id: ELEMENT_ID.PRODUCT_SELECT,
    className: 'border rounded p-2 mr-2',
  });
  const $addToCartButton = createElement('button', {
    id: ELEMENT_ID.ADD_TO_CART,
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
    events: {
      click: addToCartClickHandler,
    },
  });
  const $wrapper = createElement('div', {
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
    children: [
      $cartText,
      $cart,
      $cartTotalSummary,
      $stockStatus,
      $productSelect,
      $addToCartButton,
    ],
  });
  const $content = createElement('div', {
    className: 'bg-gray-100 p-8',
    children: [$wrapper],
  });

  const root = document.getElementById('app');
  root.appendChild($content);

  updateProductSelect();
  updateCartTotals();

  startFlashSalePromotion(updateProductSelect);
  startProductRecommendationPromotion(updateProductSelect);
};

main();
