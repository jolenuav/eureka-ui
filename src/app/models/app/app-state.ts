import Commerce from '../db/commerce';
import DeliveryFee from '../db/delivery-fee';
import GenericModel from './generic-model';

export interface AppState {
  commerces: Commerce[];
  deliveryFees: DeliveryFee[];
  documentTypes: GenericModel[];
  paymentMethods: GenericModel[];
}
