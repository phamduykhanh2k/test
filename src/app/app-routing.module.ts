import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdmin, AuthGuard, IsLogin } from './guards/auth.guard';
import { AboutComponent } from './main/about/about.component';
import { UserAuthComponent } from './main/user-auth/user-auth.component';
import { ShopComponent } from './main/shop/shop.component';
import { HomeComponent } from './main/home/home.component';
import { ProductDetailsComponent } from './main/product-details/product-details.component';
import { PageNotFoundComponent } from './main/page-not-found/page-not-found.component';
import { CartPageComponent } from './main/cart-page/cart-page.component';
import { ContactComponent } from './main/contact/contact.component';
import { ManagerComponent } from './main/manager/manager.component';
import { ProductManagerComponent } from './main/manager/product-manager/product-manager.component';
import { SettingsComponent } from './main/settings/settings.component';
import { AccountComponent } from './main/settings/account/account.component';
import { OrdersComponent } from './main/settings/orders/orders.component';
import { CategoryManagerComponent } from './main/manager/category-manager/category-manager.component';
import { CheckoutComponent } from './main/checkout/checkout.component';
import { OrderManagerComponent } from './main/manager/order-manager/order-manager.component';
import { OrderDetailComponent } from './main/order-detail/order-detail.component';
import { UserManagerComponent } from './main/manager/user-manager/user-manager.component';
import { FeedbacksComponent } from './main/settings/feedbacks/feedbacks.component';
import { CheckoutResultComponent } from './main/checkout-result/checkout-result.component';
import { VoucherManagerComponent } from './main/manager/voucher-manager/voucher-manager.component';
import { DashboardComponent } from './main/manager/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'authentication', component: UserAuthComponent },
  { path: 'about', component: AboutComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartPageComponent, canActivate: [IsLogin] },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [IsLogin],
  },
  { path: 'checkout-result', component: CheckoutResultComponent, canActivate: [IsLogin] },
  { path: 'contact', component: ContactComponent },
  { path: 'orders/:id', component: OrderDetailComponent, canActivate: [IsLogin] },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [IsLogin],
    children: [
      { path: '', redirectTo: '/settings/account', pathMatch: 'full' },
      { path: 'account', component: AccountComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'feedbacks', component: FeedbacksComponent },
    ]
  },
  {
    path: 'manager',
    component: ManagerComponent,
    canActivate: [IsAdmin],
    children: [
      { path: '', redirectTo: '/manager/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductManagerComponent },
      { path: 'users', component: UserManagerComponent },
      { path: 'orders', component: OrderManagerComponent },
      { path: 'categories', component: CategoryManagerComponent },
      { path: 'vouchers', component: VoucherManagerComponent },
    ]
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
