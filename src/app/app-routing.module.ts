import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAccessAuthGuard } from './guards/partner/admin-acess-auth.guard';
import { LoginAuthGuard } from './guards/partner/login-auth.guard';
import { PartnerViewAuthGuard } from './guards/partner/partner-view-auth.guard';
import { CommerceSelectedResolver } from './resolvers/commerce-selected.resolver';
import { FormProductsResolver } from './resolvers/form-products.resolver';
import { LoadOrderResolver } from './resolvers/load-order.resolver';
import { SearchProductsResolver } from './resolvers/search-products.resolver';
import { SelectPaymentResolver } from './resolvers/select-payment.resolver';
import { AdminCommercesComponent } from './screens/admin/admin-commerces/admin-commerces.component';
import { ListCommercesComponent } from './screens/admin/list-commerces/list-commerces.component';
import { LoginComponent } from './screens/autheticate/login/login.component';
import { LoadOrderComponent } from './screens/customer/load-order/load-order.component';
import { OrderConfirmComponent } from './screens/customer/order-confirm/order-confirm.component';
import { OrderComponent } from './screens/customer/order/order.component';
import { SearchCommerceComponent } from './screens/customer/search-commerce/search-commerce.component';
import { SearchProductsComponent } from './screens/customer/search-products/search-products.component';
import { SelectPaymentComponent } from './screens/customer/select-payment/select-payment.component';
import { OrderListComponent } from './screens/vendor/order-list/order-list.component';
import { ListProductsComponent } from './screens/vendor/products/list-products/list-products.component';
import { ProductFormComponent } from './screens/vendor/products/product-form/product-form.component';
import { StockComponent } from './screens/vendor/stock/stock.component';
import { ROUTES } from './utils/routes';

const routes: Routes = [
  {
    path: ROUTES.commerces,
    component: SearchCommerceComponent,
  },
  {
    path: ROUTES.customer.listProducts,
    children: [
      {
        path: '',
        component: SearchProductsComponent,
        resolve: { searchProduct: SearchProductsResolver },
      },
      {
        path: ROUTES.customer.order,
        component: OrderComponent,
        resolve: { commerce: CommerceSelectedResolver },
      },
      {
        path: ROUTES.customer.loadOrder,
        component: LoadOrderComponent,
        resolve: { loadOrder: LoadOrderResolver },
      },
      {
        path: ROUTES.customer.paymentMethod,
        component: SelectPaymentComponent,
        resolve: { selectPayment: SelectPaymentResolver },
      },
      {
        path: ROUTES.customer.orderConfirm,
        component: OrderConfirmComponent,
        resolve: { commerce: CommerceSelectedResolver },
      },
    ],
  },
  {
    path: ROUTES.partner.main,
    children: [
      {
        path: '',
        component: OrderListComponent,
      },
      {
        path: ROUTES.partner.login,
        component: LoginComponent,
        canActivate: [LoginAuthGuard],
      },
      {
        path: ROUTES.partner.orderList,
        component: OrderListComponent,
        canActivate: [PartnerViewAuthGuard],
      },
      {
        path: ROUTES.partner.listCommerce,
        component: ListCommercesComponent,
        canActivate: [AdminAccessAuthGuard],
      },
      {
        path: ROUTES.partner.adminCommerce,
        component: AdminCommercesComponent,
        canActivate: [AdminAccessAuthGuard],
        resolve: { selectPayment: SelectPaymentResolver },
      },
      {
        path: ROUTES.partner.listProduct,
        component: ListProductsComponent,
        canActivate: [PartnerViewAuthGuard],
      },
      {
        path: ROUTES.partner.adminProduct,
        component: ProductFormComponent,
        canActivate: [PartnerViewAuthGuard],
        resolve: { adminProduct: FormProductsResolver },
      },
      {
        path: ROUTES.partner.stock,
        component: StockComponent,
        canActivate: [PartnerViewAuthGuard],
      },
    ],
  },
  { path: '', redirectTo: ROUTES.commerces, pathMatch: 'full' },
  { path: '**', redirectTo: ROUTES.commerces, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
