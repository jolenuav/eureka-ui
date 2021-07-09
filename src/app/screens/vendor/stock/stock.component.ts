import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subscription } from 'rxjs';
import Commerce from 'src/app/models/db/commerce';
import Stock from 'src/app/models/db/stock/stock';
import StockMovement from 'src/app/models/db/stock/stock-movement';
import { UserTypeEnum } from 'src/app/models/enums/user-type.enum';
import { StockService } from 'src/app/services/firestore/stock.service';
import { VendorStoreService } from 'src/app/services/vendor-store.service';
import { CONSTANTS } from 'src/app/utils/constants';
import { StockFormComponent } from './modals/stock-form/stock-form.component';
import { StockMovementsComponent } from './modals/stock-moviments/stock-movements.component';

@Component({
  selector: 'eu-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit, OnDestroy {
  commerce: Commerce;
  stocksSubject = new BehaviorSubject<Stock[]>([]);
  stocks$ = this.stocksSubject.asObservable();
  showInputCommerce = false;
  user = this.vendorStore.user;
  subscribeStockService: Subscription;

  constructor(
    private modalService: NgbModal,
    private stockService: StockService,
    private vendorStore: VendorStoreService
  ) {}

  ngOnInit(): void {
    if (
      this.user.type === UserTypeEnum.admin &&
      this.user.roles.some((r) => r === CONSTANTS.roles.all)
    ) {
      this.showInputCommerce = true;
    }
    this.getSnapshotStocks();
  }

  ngOnDestroy(): void {
    this.subscribeStockService?.unsubscribe();
  }

  getSnapshotStocks(): void {
    console.log(this.commerce);
    if (this.commerce) {
      this.subscribeStockService = this.stockService
        .findByCommerceIdSnapshot(this.commerce.id)
        .subscribe((stocks) => {
          console.log(stocks);
          this.stocksSubject.next(stocks);
        });
    }
  }

  changeCommerce(commerce: Commerce): void {
    console.log(commerce);
    this.commerce = commerce.clone();
    this.getSnapshotStocks();
  }

  openMoviments(_movements: StockMovement[]): void {
    const modalRef = this.modalService.open(StockMovementsComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.configModal(_movements);
  }

  openStockForm(type: number, stock: Stock): void {
    const params = {
      type,
      stock,
    };
    const modalRef = this.modalService.open(StockFormComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.configModal(params);
  }
}
