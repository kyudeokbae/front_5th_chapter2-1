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
import { createElement } from '../lib';

const renderPoints = () => {
  const totalAmount = getState('totalAmount');
  const points = Math.floor(totalAmount / 1000);
  const pointsText = '(포인트: ' + points + ')';

  let pointsElement = document.getElementById(ELEMENT_ID.LOYALTY_POINTS);

  if (!pointsElement) {
    pointsElement = createElement('span', {
      id: ELEMENT_ID.LOYALTY_POINTS,
      className: 'text-blue-500 ml-2',
      textContent: pointsText,
    });

    document
      .getElementById(ELEMENT_ID.CART_TOTAL_SUMMARY)
      .appendChild(pointsElement);
  } else {
    pointsElement.textContent = pointsText;
  }
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

const calculateDiscounts = (
  totalQuantity,
  totalAmountWithoutDiscount,
  calculatedTotalAmount
) => {
  // 상품별 할인
  const itemBasedDiscountAmount =
    totalAmountWithoutDiscount - calculatedTotalAmount;

  let discountRate = itemBasedDiscountAmount / totalAmountWithoutDiscount || 0;

  // 대량 구매 할인
  if (totalQuantity >= MIN_QUANTITY_FOR_BULK_DISCOUNT) {
    const bulkDiscountAmount = totalAmountWithoutDiscount * BULK_DISCOUNT_RATE;
    if (bulkDiscountAmount > itemBasedDiscountAmount) {
      calculatedTotalAmount =
        totalAmountWithoutDiscount * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    }
  }

  // 화요일 할인
  if (new Date().getDay() === DAYS_OF_WEEK.TUESDAY) {
    calculatedTotalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }

  return {
    finalTotalAmount: calculatedTotalAmount,
    discountRate,
  };
};

const renderDiscount = (discountRate) => {
  const discountElement = createElement('span', {
    className: 'text-green-500 ml-2',
    textContent: '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)',
  });

  document
    .getElementById(ELEMENT_ID.CART_TOTAL_SUMMARY)
    .appendChild(discountElement);
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

  const { finalTotalAmount, discountRate } = calculateDiscounts(
    totalQuantity,
    totalAmountWithoutDiscount,
    calculatedTotalAmount
  );

  document.getElementById(ELEMENT_ID.CART_TOTAL_SUMMARY).textContent =
    '총액: ' + Math.round(finalTotalAmount) + '원';

  if (discountRate > 0) {
    renderDiscount(discountRate);
  }

  dispatch('updateTotalAmount', finalTotalAmount);
  updateStockStatus();
  renderPoints();
};
