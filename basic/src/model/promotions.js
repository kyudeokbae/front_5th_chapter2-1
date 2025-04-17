import { getState } from '../store';
import {
  FLASH_SALE_INTERVAL_MS,
  FLASH_SALE_INITIAL_DELAY_MAX_MS,
  FLASH_SALE_PROBABILITY,
  FLASH_SALE_DISCOUNT_RATE,
  RECOMMENDATION_INTERVAL_MS,
  RECOMMENDATION_INITIAL_DELAY_MAX_MS,
  RECOMMENDATION_DISCOUNT_RATE,
} from '../consts';

/**
 * 번개세일
 * @param {Function} updateUI
 */
export const startFlashSalePromotion = (updateUI) => {
  setTimeout(() => {
    setInterval(() => {
      const products = getState('products');
      const luckyItem = products[Math.floor(Math.random() * products.length)];

      if (Math.random() < FLASH_SALE_PROBABILITY && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(
          luckyItem.price * FLASH_SALE_DISCOUNT_RATE
        );
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateUI();
      }
    }, FLASH_SALE_INTERVAL_MS);
  }, Math.random() * FLASH_SALE_INITIAL_DELAY_MAX_MS);
};

/**
 * 추천 상품 프로모션
 * @param {Function} updateUI
 */
export const startProductRecommendationPromotion = (updateUI) => {
  setTimeout(() => {
    setInterval(() => {
      const lastSelectedProductId = getState('lastSelectedProductId');
      if (lastSelectedProductId) {
        const products = getState('products');
        const suggestItem = products.find((item) => {
          return item.id !== lastSelectedProductId && item.quantity > 0;
        });

        if (suggestItem) {
          alert(
            suggestItem.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggestItem.price = Math.round(
            suggestItem.price * RECOMMENDATION_DISCOUNT_RATE
          );
          updateUI();
        }
      }
    }, RECOMMENDATION_INTERVAL_MS);
  }, Math.random() * RECOMMENDATION_INITIAL_DELAY_MAX_MS);
};
