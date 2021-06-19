import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAccessAuthGuard } from './guards/partner/admin-acess-auth.guard';
import { LoginAuthGuard } from './guards/partner/login-auth.guard';
import { PartnerViewAuthGuard } from './guards/partner/partner-view-auth.guard';
import { CommerceSelectedResolver } from './resolvers/commerce-selected.resolver';
import { LoadOrderResolver } from './resolvers/load-order.resolver';
import { SearchProductsResolver } from './resolvers/search-products.resolver';
import { SelectPaymentResolver } from './resolvers/select-payment.resolver';
import { AdminCommercesComponent } from './screens/admin/admin-commerces/admin-commerces.component';
import { LoadOrderComponent } from './screens/customer/load-order/load-order.component';
import { OrderConfirmComponent } from './screens/customer/order-confirm/order-confirm.component';
import { OrderComponent } from './screens/customer/order/order.component';
import { SearchCommerceComponent } from './screens/customer/search-commerce/search-commerce.component';
import { SearchProductsComponent } from './screens/customer/search-products/search-products.component';
import { SelectPaymentComponent } from './screens/customer/select-payment/select-payment.component';
import { LoginComponent } from './screens/vendor/authenticate/login/login.component';
import { OrderListComponent } from './screens/vendor/containers/order-list/order-list.component';
import { CONSTANTS } from './utils/constants';

const routes: Routes = [
  {
    path: CONSTANTS.routes.commerces,
    component: SearchCommerceComponent,
  },
  {
    path: CONSTANTS.routes.customer.listProducts,
    children: [
      {
        path: '',
        component: SearchProductsComponent,
        resolve: { searchProduct: SearchProductsResolver },
      },
      {
        path: CONSTANTS.routes.customer.order,
        component: OrderComponent,
        resolve: { commerce: CommerceSelectedResolver },
      },
      {
        path: CONSTANTS.routes.customer.loadOrder,
        component: LoadOrderComponent,
        resolve: { loadOrder: LoadOrderResolver },
      },
      {
        path: CONSTANTS.routes.customer.paymentMethod,
        component: SelectPaymentComponent,
        resolve: { selectPayment: SelectPaymentResolver },
      },
      {
        path: CONSTANTS.routes.customer.orderConfirm,
        component: OrderConfirmComponent,
        resolve: { commerce: CommerceSelectedResolver },
      },
    ],
  },
  {
    path: CONSTANTS.routes.partner.main,
    children: [
      {
        path: '',
        component: OrderListComponent,
      },
      {
        path: CONSTANTS.routes.partner.login,
        component: LoginComponent,
        canActivate: [LoginAuthGuard],
      },
      {
        path: CONSTANTS.routes.partner.orderList,
        component: OrderListComponent,
        canActivate: [PartnerViewAuthGuard],
      },
      {
        path: CONSTANTS.routes.partner.adminCommerce,
        component: AdminCommercesComponent,
        canActivate: [AdminAccessAuthGuard],
      },
    ],
  },
  { path: '', redirectTo: CONSTANTS.routes.commerces, pathMatch: 'full' },
  { path: '**', redirectTo: CONSTANTS.routes.commerces, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
