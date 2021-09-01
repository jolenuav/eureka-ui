import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BtnFooterComponent } from './components/btn-footer/btn-footer.component';
import { CardProductComponent } from './components/card/card-product.component';
import { IconTitleComponent } from './components/icon-title/icon-title.component';
import { InputFileComponent } from './components/input-file/input-file.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MapComponent } from './components/map/map.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AutocompleteCommerceComponent } from './components/search-commerce/autocomplete-commerce.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SimpleChipComponent } from './components/simple-chip/simple-chip.component';
import { ScrollSpyDirective } from './directives/scroll-spy.directive';
import { AdminAccessAuthGuard } from './guards/partner/admin-acess-auth.guard';
import { LoginAuthGuard } from './guards/partner/login-auth.guard';
import { PartnerViewAuthGuard } from './guards/partner/partner-view-auth.guard';
import { CatalogResolver } from './resolvers/catalog.resolver';
import { CommerceSelectedResolver } from './resolvers/commerce-selected.resolver';
import { FormProductsResolver } from './resolvers/form-products.resolver';
import { ListCommercesAdminResolver } from './resolvers/list-commerce-admin.resolver';
import { LoadOrderResolver } from './resolvers/load-order.resolver';
import { SearchProductsResolver } from './resolvers/search-products.resolver';
import { SelectPaymentResolver } from './resolvers/select-payment.resolver';
import { AdminCommercesComponent } from './screens/admin/admin-commerces/admin-commerces.component';
import { CommerceFormComponent } from './screens/admin/commerce-form/commerce-form.component';
import { ListCommercesComponent } from './screens/admin/list-commerces/list-commerces.component';
import { LoginComponent } from './screens/autheticate/login/login.component';
import { CatalogComponent } from './screens/customer/catalog/catalog.component';
import { CategoryCatalogComponent } from './screens/customer/catalog/category-catalog/category-catalog.component';
import { ProductCatalogComponent } from './screens/customer/catalog/product-catalog/product-catalog.component';
import { LoadOrderComponent } from './screens/customer/load-order/load-order.component';
import { OrderConfirmComponent } from './screens/customer/order-confirm/order-confirm.component';
import { OrderComponent } from './screens/customer/order/order.component';
import { SearchCommerceComponent } from './screens/customer/search-commerce/search-commerce.component';
import { SearchProductsComponent } from './screens/customer/search-products/search-products.component';
import { SelectPaymentComponent } from './screens/customer/select-payment/select-payment.component';
import { CategoriesComponent } from './screens/vendor/categories/categories.component';
import { DetailModalComponent } from './screens/vendor/order-list/detail-modal/detail-modal.component';
import { OrderListComponent } from './screens/vendor/order-list/order-list.component';
import { ListProductsComponent } from './screens/vendor/products/list-products/list-products.component';
import { ProductFormComponent } from './screens/vendor/products/product-form/product-form.component';
import { StockFormComponent } from './screens/vendor/stock/modals/stock-form/stock-form.component';
import { StockMovementsComponent } from './screens/vendor/stock/modals/stock-moviments/stock-movements.component';
import { StockComponent } from './screens/vendor/stock/stock.component';
import { AppInitializerService } from './services/app-initializer.service';
import { AuthService } from './services/authenticate.service';
import { StoreService } from './services/store/store.service';
import { PipeModule } from './utils/pipe.module';
import { InMaintenanceComponent } from './screens/in-maintenance/in-maintenance.component';

export function initApp(provider: AppInitializerService): any {
  return () => provider.load();
}

@NgModule({
  declarations: [
    AppComponent,
    ScrollSpyDirective,
    SearchCommerceComponent,
    LoaderComponent,
    CardProductComponent,
    SearchProductsComponent,
    LoadOrderComponent,
    OrderComponent,
    SelectPaymentComponent,
    BtnFooterComponent,
    OrderConfirmComponent,
    OrderListComponent,
    DetailModalComponent,
    LoginComponent,
    NavbarComponent,
    SidebarComponent,
    IconTitleComponent,
    CommerceFormComponent,
    AdminCommercesComponent,
    ProductFormComponent,
    MapComponent,
    ListCommercesComponent,
    ListProductsComponent,
    AutocompleteCommerceComponent,
    StockComponent,
    StockMovementsComponent,
    StockFormComponent,
    CategoriesComponent,
    SimpleChipComponent,
    InputFileComponent,
    CatalogComponent,
    CategoryCatalogComponent,
    ProductCatalogComponent,
    InMaintenanceComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    NgbModule,
    PipeModule,
    BrowserAnimationsModule,
    // ANGULAR MATERILA
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSnackBarModule,
    MatStepperModule,
    MatToolbarModule,
  ],
  providers: [
    // SERVICES
    AppInitializerService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AppInitializerService],
      multi: true,
    },
    StoreService,
    AuthService,
    // RESOLVERS
    CatalogResolver,
    CommerceSelectedResolver,
    FormProductsResolver,
    ListCommercesAdminResolver,
    LoadOrderResolver,
    SearchProductsResolver,
    SelectPaymentResolver,
    // GUARDS
    AdminAccessAuthGuard,
    PartnerViewAuthGuard,
    LoginAuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
