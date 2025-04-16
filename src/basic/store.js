const initialProducts = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

const store = {
  state: {
    products: [...initialProducts],
    lastSelectedProductId: null,
    totalAmount: 0,
  },
  actions: {
    updateProducts: (newProducts) => (store.state.products = newProducts),
    updateLastSelectedProductId: (productId) =>
      (store.state.lastSelectedProductId = productId),
    updateTotalAmount: (amount) => (store.state.totalAmount = amount),
  },
};

export const getState = (key) => store.state[key] ?? null;
export const dispatch = (action, ...args) =>
  store.actions[action] && store.actions[action](...args);
