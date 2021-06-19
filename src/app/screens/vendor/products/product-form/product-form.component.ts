import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Commerce from 'src/app/models/db/commerce';
import Product from 'src/app/models/db/product';
import { CommerceService } from 'src/app/services/firestore/commerce.service';
import { ProductService } from 'src/app/services/firestore/product.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'eu-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  commercesSubject = new BehaviorSubject<Commerce[]>([]);
  filteredCommecesSubject = new BehaviorSubject<Commerce[]>([]);
  filteredCommeces$;
  formGroup = new FormGroup({
    commerce: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    section: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
  });
  subscription: Subscription;

  constructor(
    private cd: ChangeDetectorRef,
    private commerceService: CommerceService,
    private productService: ProductService,
    private store: StoreService
  ) {}

  ngOnInit(): void {
    this.subscription = this.commerceService
      .findAllSnapshot()
      .subscribe((commerces) => {
        this.commercesSubject.next(commerces);
        this.filteredCommecesSubject.next(commerces);
        this.filteredCommeces$ = this.filteredCommecesSubject.asObservable();
      });

    this.filteredCommeces$ = this.formGroup.controls.commerce.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.i)),
      map((idOrAny) =>
        idOrAny
          ? this.filterCommerce(idOrAny)
          : this.commercesSubject.value.slice()
      )
    );
  }

  filterCommerce(value: string): Commerce[] {
    value = value.toUpperCase();
    const resp = this.commercesSubject.value.filter(
      (commerce) =>
        commerce.id.includes(value) ||
        commerce.name.toUpperCase().includes(value)
    );
    return resp;
  }

  displayCommerceName(commerce: Commerce): string {
    return commerce ? `${commerce.id} ${commerce.name}` : '';
  }

  async onSaveOrUpdate(): Promise<void> {
    this.store.startLoader();
    const products = await this.productService.findByCommerceId(
      this.formGroup.controls.commerce.value?.id
    );
    const secuency = products.length + 1;
    const id = `${this.formGroup.controls.commerce.value.id}-${secuency
      .toString()
      .padStart(6, '0')}`;
    const resp = await this.productService.findById(id);
    if (resp) {
      this.store.endLoader();
      return;
    }
    const product = new Product();
    product.id = id;
    product.commerce = this.formGroup.controls.commerce.value.id;
    product.name = this.formGroup.controls.name.value;
    product.price = this.formGroup.controls.price.value;
    product.section = this.formGroup.controls.section.value;
    product.description = this.formGroup.controls.description.value;
    await this.productService.save(product);
    this.store.endLoader();
  }
}
