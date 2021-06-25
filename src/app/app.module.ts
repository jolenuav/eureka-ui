import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BtnFooterComponent } from './components/btn-footer/btn-footer.component';
import { CardProductComponent } from './components/card/card-product.component';
import { IconTitleComponent } from './components/icon-title/icon-title.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MapComponent } from './components/map/map.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ScrollSpyDirective } from './directives/scroll-spy.directive';
import { AdminAccessAuthGuard } from './guards/partner/admin-acess-auth.guard';
import { LoginAuthGuard } from './guards/partner/login-auth.guard';
import { PartnerViewAuthGuard } from './guards/partner/partner-view-auth.guard';
import { CommerceSelectedResolver } from './resolvers/commerce-selected.resolver';
import { LoadOrderResolver } from './resolvers/load-order.resolver';
import { SearchProductsResolver } from './resolvers/search-products.resolver';
import { SelectPaymentResolver } from './resolvers/select-payment.resolver';
import { AdminCommercesComponent } from './screens/admin/admin-commerces/admin-commerces.component';
import { CommerceFormComponent } from './screens/admin/commerce-form/commerce-form.component';
import { LoginComponent } from './screens/autheticate/login/login.component';
import { LoadOrderComponent } from './screens/customer/load-order/load-order.component';
import { OrderConfirmComponent } from './screens/customer/order-confirm/order-confirm.component';
import { OrderComponent } from './screens/customer/order/order.component';
import { SearchCommerceComponent } from './screens/customer/search-commerce/search-commerce.component';
import { SearchProductsComponent } from './screens/customer/search-products/search-products.component';
import { SelectPaymentComponent } from './screens/customer/select-payment/select-payment.component';
import { DetailModalComponent } from './screens/vendor/order-list/detail-modal/detail-modal.component';
import { OrderListComponent } from './screens/vendor/order-list/order-list.component';
import { ProductFormComponent } from './screens/vendor/products/product-form/product-form.component';
import { AppInitializerService } from './services/app-initializer.service';
import { AuthService } from './services/authenticate.service';
import { StoreService } from './services/store.service';
import { PipeModule } from './utils/pipe.module';
import { ListCommercesComponent } from './screens/admin/list-commerces/list-commerces.component';

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
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
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
    CommerceSelectedResolver,
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
