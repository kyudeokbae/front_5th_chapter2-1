const products = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

let ProductSelectOptions, AddToCartButton, Cart, CartTotalSummary, StockStatus;

// 전역 스토어로 관리
let lastSelectedProductId,
  totalAmount = 0;

const main = () => {
  let hTxt = document.createElement('h1');
  hTxt.className = 'text-2xl font-bold mb-4';
  hTxt.textContent = '장바구니';

  Cart = document.createElement('div');
  Cart.id = 'cart-items';

  CartTotalSummary = document.createElement('div');
  CartTotalSummary.id = 'cart-total';
  CartTotalSummary.className = 'text-xl font-bold my-4';

  ProductSelectOptions = document.createElement('select');
  ProductSelectOptions.id = 'product-select';
  ProductSelectOptions.className = 'border rounded p-2 mr-2';

  AddToCartButton = document.createElement('button');
  AddToCartButton.id = 'add-to-cart';
  AddToCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  AddToCartButton.textContent = '추가';

  StockStatus = document.createElement('div');
  StockStatus.id = 'stock-status';
  StockStatus.className = 'text-sm text-gray-500 mt-2';

  const wrap = document.createElement('div');
  wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  wrap.appendChild(hTxt);
  wrap.appendChild(Cart);
  wrap.appendChild(CartTotalSummary);
  wrap.appendChild(ProductSelectOptions);
  wrap.appendChild(AddToCartButton);
  wrap.appendChild(StockStatus);

  let cont = document.createElement('div');
  cont.className = 'bg-gray-100 p-8';
  cont.appendChild(wrap);

  const root = document.getElementById('app');
  root.appendChild(cont);

  updateSelectOptions();
  updateCartTotals();

  setTimeout(() => {
    setInterval(() => {
      const luckyItem = products[Math.floor(Math.random() * products.length)];

      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedProductId) {
        const suggestItem = products.find((item) => {
          return item.id !== lastSelectedProductId && item.quantity > 0;
        });

        if (suggestItem) {
          alert(
            suggestItem.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggestItem.price = Math.round(suggestItem.price * 0.95);
          updateSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

// main 내부에서 사용
const updateSelectOptions = () => {
  ProductSelectOptions.innerHTML = '';

  products.forEach((product) => {
    const selectOption = document.createElement('option');
    selectOption.value = product.id;
    selectOption.textContent = product.name + ' - ' + product.price + '원';
    selectOption.disabled = product.quantity === 0;

    ProductSelectOptions.appendChild(selectOption);
  });
};

// main, 이벤트 리스너에서 사용
const updateCartTotals = () => {
  const cartItems = Cart.children;
  let totalQuantity = 0;
  let totalAmountWithoutDiscount = 0;
  totalAmount = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const itemInfo = products.find((product) => product.id === cartItems[i].id);
    const itemQuantity = parseInt(
      cartItems[i].querySelector('span').textContent.split('x ')[1]
    );
    const itemTotalAmount = itemInfo.price * itemQuantity;

    totalQuantity += itemQuantity;
    totalAmountWithoutDiscount += itemTotalAmount;

    const PRODUCT_DISCOUNT_RATES = {
      p1: 0.1,
      p2: 0.15,
      p3: 0.2,
      p4: 0.05,
      p5: 0.25,
    };
    // 유틸 함수 분리
    const calculateItemDiscountRate = (productId, quantity) => {
      // 상수 분리
      const MIN_QUANTITY_FOR_ITEM_DISCOUNT = 10;

      if (quantity >= MIN_QUANTITY_FOR_ITEM_DISCOUNT) {
        return PRODUCT_DISCOUNT_RATES[productId] ?? 0;
      }

      return 0;
    };
    const itemDiscountRate = calculateItemDiscountRate(
      itemInfo.id,
      itemQuantity
    );
    totalAmount += itemTotalAmount * (1 - itemDiscountRate);
  }

  const itemBasedDiscountAmount = totalAmountWithoutDiscount - totalAmount;
  let discountRate = itemBasedDiscountAmount / totalAmountWithoutDiscount;
  // 상수 분리
  const MIN_QUANTITY_FOR_BULK_DISCOUNT = 30;
  if (totalQuantity >= MIN_QUANTITY_FOR_BULK_DISCOUNT) {
    // 상수 분리
    const BULK_DISCOUNT_RATE = 0.25;
    const additionalBulkDiscountAmount = totalAmount * BULK_DISCOUNT_RATE;

    if (additionalBulkDiscountAmount > itemBasedDiscountAmount) {
      totalAmount = totalAmountWithoutDiscount * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    }
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  CartTotalSummary.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    CartTotalSummary.appendChild(span);
  }

  updateStockStatus();
  renderPoints();
};

// updateCartTotals 에서 호출
const renderPoints = () => {
  const points = Math.floor(totalAmount / 1000);

  let ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    CartTotalSummary.appendChild(ptsTag);
  }
  ptsTag.textContent = '(포인트: ' + points + ')';
};

// updateCartTotals 에서 호출
const updateStockStatus = () => {
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

  StockStatus.textContent = stockStatusMessage;
};

main();

AddToCartButton.addEventListener('click', () => {
  const selectedProductId = ProductSelectOptions.value;
  const productToAdd = products.find((product) => {
    return product.id === selectedProductId;
  });

  if (productToAdd && productToAdd.quantity > 0) {
    const item = document.getElementById(productToAdd.id);

    if (item) {
      const newQuantity =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;

      if (newQuantity <= productToAdd.quantity) {
        item.querySelector('span').textContent =
          productToAdd.name +
          ' - ' +
          productToAdd.price +
          '원 x ' +
          newQuantity;
        productToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = productToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        productToAdd.name +
        ' - ' +
        productToAdd.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        productToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        productToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        productToAdd.id +
        '">삭제</button></div>';
      Cart.appendChild(newItem);
      productToAdd.quantity--;
    }

    updateCartTotals();
    lastSelectedProductId = selectedProductId;
  }
});

Cart.addEventListener('click', (event) => {
  const { target } = event;
  const isChangeQuantity = target.classList.contains('quantity-change');
  const isRemove = target.classList.contains('remove-item');

  if (!isChangeQuantity && !isRemove) return;

  const productId = target.dataset.productId;
  const targetProduct = products.find((product) => {
    return product.id === productId;
  });
  const cartItemElement = document.getElementById(productId);
  const cartItemSummaryElement = cartItemElement.querySelector('span');
  const [cartItemPrice, cartItemQuantity] =
    cartItemSummaryElement.textContent.split('x ');
  const quantityInCart = parseInt(cartItemQuantity);

  if (isChangeQuantity) {
    const quantityChange = parseInt(target.dataset.change);
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
  } else if (isRemove) {
    targetProduct.quantity += quantityInCart;
    cartItemElement.remove();
  }

  updateCartTotals();
});
