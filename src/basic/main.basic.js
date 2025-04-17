import {
  updateCartTotals,
  updateProductSelect,
  startFlashSalePromotion,
  startProductRecommendationPromotion,
} from './model';
import { renderPage } from './ui';

const main = () => {
  renderPage();

  updateProductSelect();
  updateCartTotals();

  startFlashSalePromotion(updateProductSelect);
  startProductRecommendationPromotion(updateProductSelect);
};

main();
