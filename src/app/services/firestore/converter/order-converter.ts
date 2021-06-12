import Order from 'src/app/models/db/order/order';

export function converterByDB(order: Order): any {
  const orderDB = {
    ...order.getSimpleObject(),
    products: order.getSimpleObject().products.map((p) => {
      const prod = {
        ...p,
        product: p.product.id,
      };
      return prod;
    }),
  };
  return orderDB;
}
