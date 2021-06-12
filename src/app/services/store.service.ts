import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppState } from '../models/app/app-state';
import GenericModel from '../models/app/generic-model';
import PaymentMethod from '../models/db/payment-method';
import Product from '../models/db/product';
import { CONSTANTS } from '../utils/constants';
import { CommerceService } from './firestore/commerce.service';
import { DeliveryFeeService } from './firestore/delivery-fee.service';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  _appState = new BehaviorSubject<AppState>({
    commerces: [],
    deliveryFees: [],
    documentTypes: [],
    paymentMethods: PaymentMethod.LIST,
  });

  showLoader = new BehaviorSubject<boolean>(false);

  constructor(
    private _commerceService: CommerceService,
    private _deliveryFeeService: DeliveryFeeService
  ) {}

  get appState(): AppState {
    return { ...this._appState.value };
  }

  getAppState(): AppState {
    return { ...this._appState.value };
  }

  startLoader(): void {
    this.showLoader.next(true);
  }

  endLoader(): void {
    this.showLoader.next(false);
  }

  async initialApp(): Promise<void> {
    this.startLoader();
    await this.loadCommerces();
    await this.loadDocumentTypes();
    await this.loadDeliveryFees();
    this.endLoader();
  }

  async loadCommerces(): Promise<void> {
    const commerces: any = await this._commerceService.findAll();
    this._appState.next({
      ...this.appState,
      commerces,
    });
  }

  async loadDocumentTypes(): Promise<void> {
    const documentTypes: GenericModel[] = [];
    documentTypes.push(GenericModel.parse(CONSTANTS.documentTypes.identityCard));
    documentTypes.push(GenericModel.parse(CONSTANTS.documentTypes.passport));
    this._appState.next({
      ...this.appState,
      documentTypes,
    });
  }

  async loadDeliveryFees(): Promise<void> {
    const deliveryFees: any = await this._deliveryFeeService.findAll();
    this._appState.next({
      ...this.appState,
      deliveryFees,
    });
  }
}
