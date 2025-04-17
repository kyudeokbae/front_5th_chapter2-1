import {
  PRODUCT_DISCOUNT_RATES,
  ELEMENT_ID,
  DAYS_OF_WEEK,
  TUESDAY_DISCOUNT_RATE,
  MIN_QUANTITY_FOR_ITEM_DISCOUNT,
  MIN_QUANTITY_FOR_BULK_DISCOUNT,
  BULK_DISCOUNT_RATE,
} from '../consts';
import { dispatch, getState } from '../store';

const renderPoints = () => {
  const totalAmount = getState('totalAmount');
  const points = Math.floor(totalAmount / 1000);

  let pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    document
      .getElementById(ELEMENT_ID.CART_TOTAL_SUMMARY)
      .appendChild(pointsTag);
  }
  pointsTag.textContent = '(포인트: ' + points + ')';
};

const calculateItemDiscountRate = (productId, quantity) => {
  if (quantity >= MIN_QUANTITY_FOR_ITEM_DISCOUNT) {
    return PRODUCT_DISCOUNT_RATES[productId] ?? 0;
  }

  return 0;
};

const updateStockStatus = () => {
  const products = getState('products');
  const stockStatusMessage = products
    .filter((product) => product.quantity < 5)
    .map(
      (product) =>
        product.name +
        ': ' +
        (product.quantity > 0
          ? '재고 부족 (' + product.quantity + '개 남음)'
          : '품절')
    )
    .join('\n');

  document.getElementById(ELEMENT_ID.STOCK_STATUS).textContent =
    stockStatusMessage;
};

export const updateCartTotals = () => {
  const cartItems = document.getElementById(ELEMENT_ID.CART).children;
  let totalQuantity = 0;
  let totalAmountWithoutDiscount = 0;
  let calculatedTotalAmount = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const products = getState('products');
    const itemInfo = products.find((product) => product.id === cartItems[i].id);
    const itemQuantity = parseInt(
      cartItems[i].querySelector('span').textContent.split('x ')[1]
    );
    const itemTotalAmount = itemInfo.price * itemQuantity;

    totalQuantity += itemQuantity;
    totalAmountWithoutDiscount += itemTotalAmount;

    const itemDiscountRate = calculateItemDiscountRate(
      itemInfo.id,
      itemQuantity
    );
    calculatedTotalAmount += itemTotalAmount * (1 - itemDiscountRate);
  }

  const itemBasedDiscountAmount =
    totalAmountWithoutDiscount - calculatedTotalAmount;
  let discountRate = itemBasedDiscountAmount / totalAmountWithoutDiscount;
  if (totalQuantity >= MIN_QUANTITY_FOR_BULK_DISCOUNT) {
    const additionalBulkDiscountAmount =
      calculatedTotalAmount * BULK_DISCOUNT_RATE;

    if (additionalBulkDiscountAmount > itemBasedDiscountAmount) {
      calculatedTotalAmount =
        totalAmountWithoutDiscount * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    }
  }

  if (new Date().getDay() === DAYS_OF_WEEK.TUESDAY) {
    calculatedTotalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }

  document.getElementById(ELEMENT_ID.CART_TOTAL_SUMMARY).textContent =
    '총액: ' + Math.round(calculatedTotalAmount) + '원';

  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    document.getElementById(ELEMENT_ID.CART_TOTAL_SUMMARY).appendChild(span);
  }

  dispatch('updateTotalAmount', calculatedTotalAmount);
  updateStockStatus();
  renderPoints();
};
