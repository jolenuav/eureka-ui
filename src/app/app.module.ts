import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BtnFooterComponent } from './components/btn-footer/btn-footer.component';
import { CardProductComponent } from './components/card/card-product.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ScrollSpyDirective } from './directives/scroll-spy.directive';
import { LoginAuthGuard } from './guards/partner/login-auth.guard';
import { PartnerViewAuthGuard } from './guards/partner/partner-view-auth.guard';
import { AuthResolver } from './resolvers/auth.resolver';
import { CommerceSelectedResolver } from './resolvers/commerce-selected.resolver';
import { LoadOrderResolver } from './resolvers/load-order.resolver';
import { SearchProductsResolver } from './resolvers/search-products.resolver';
import { SelectPaymentResolver } from './resolvers/select-payment.resolver';
import { LoadOrderComponent } from './screens/customer/load-order/load-order.component';
import { OrderConfirmComponent } from './screens/customer/order-confirm/order-confirm.component';
import { OrderComponent } from './screens/customer/order/order.component';
import { SearchCommerceComponent } from './screens/customer/search-commerce/search-commerce.component';
import { SearchProductsComponent } from './screens/customer/search-products/search-products.component';
import { SelectPaymentComponent } from './screens/customer/select-payment/select-payment.component';
import { TestComponent } from './screens/test/test.component';
import { LoginComponent } from './screens/vendor/authenticate/login/login.component';
import { DetailModalComponent } from './screens/vendor/containers/order-list/detail-modal/detail-modal.component';
import { OrderListComponent } from './screens/vendor/containers/order-list/order-list.component';
import { AppInitializerService } from './services/app-initializer.service';
import { AuthService } from './services/authenticate.service';
import { StoreService } from './services/store.service';
import { PipeModule } from './utils/pipe.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';

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
    TestComponent,
    OrderListComponent,
    DetailModalComponent,
    LoginComponent,
    NavbarComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    NgbModule,
    PipeModule,
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
    AuthResolver,
    CommerceSelectedResolver,
    LoadOrderResolver,
    SearchProductsResolver,
    SelectPaymentResolver,
    // GUARDS
    PartnerViewAuthGuard,
    LoginAuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
