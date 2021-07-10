import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import Stock from 'src/app/models/db/stock/stock';
import StockMovement from 'src/app/models/db/stock/stock-movement';
import { MovementStock } from 'src/app/models/enums/movement-stock.enum';
import { StockService } from 'src/app/services/firestore/stock.service';
import { StoreService } from 'src/app/services/store.service';
import { VendorStoreService } from 'src/app/services/vendor-store.service';

@Component({
  selector: 'eu-stock-form',
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.scss'],
})
export class StockFormComponent implements OnInit, OnDestroy {
  formGroup = new FormGroup({
    type: new FormControl(MovementStock.ADD, [Validators.required]),
    quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
  });
  stock: Stock;
  title = '';
  user = this.vendorStore.user;
  subscription: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private changeDetetorRef: ChangeDetectorRef,
    private stockService: StockService,
    private store: StoreService,
    private vendorStore: VendorStoreService
  ) {}

  ngOnInit(): void {
    this.subscription = this.formGroup.controls.type.valueChanges.subscribe(
      (val) => this.changeTitle(Number(val))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  configModal(params: { type: number; stock: Stock }): void {
    this.formGroup.controls.type.setValue(params.type);
    this.stock = params.stock;
    this.changeTitle(params.type);
  }

  changeTitle(type: number): void {
    this.title = type === 1 ? 'Agregar productos' : 'Retirar productos';
  }

  async onSaveOrUpdate(): Promise<void> {
    this.store.startLoader();
    const movement = new StockMovement();
    movement.date = new Date();
    movement.user = this.user.username;
    movement.type = Number(this.formGroup.controls.type.value);
    movement.quantity = this.formGroup.controls.quantity.value;
    this.stock.movements.push(movement);
    const total = this.stock.movements.reduce((x, stock) => {
      if (stock.type === MovementStock.ADD) {
        return x + stock.quantity;
      }
      return x - stock.quantity;
    }, 0);
    this.stock.total = total;
    this.stockService.update(this.stock);
    this.store.endLoader();
    this.activeModal.close();
  }
}
