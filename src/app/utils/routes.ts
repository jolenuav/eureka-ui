export const ROUTES = {
  commerces: 'commerces',
  customer: {
    listProducts: ':commerceUrl',
    order: 'order',
    loadOrder: 'order/load/:productId',
    paymentMethod: 'order/payment',
    orderConfirm: 'order/confirm',
  },
  partner: {
    main: 'partner',
    orderList: 'orders',
    login: 'login',
    adminCommerce: 'admin_commerce',
    adminProduct: 'admin_product',
  },
};