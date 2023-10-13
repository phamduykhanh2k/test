import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard, AuthGuard, CartGuard, LoginGuard, authGuard } from './guards/auth.guard';
import { AboutComponent } from './main/about/about.component';
import { AppComponent } from './app.component';
import { UserAuthComponent } from './main/user-auth/user-auth.component';
import { MainComponent } from './main/main.component';
import { ShopComponent } from './main/shop/shop.component';
import { HomeComponent } from './main/home/home.component';
import { ProductDetailsComponent } from './main/product-details/product-details.component';
import { PageNotFoundComponent } from './main/page-not-found/page-not-found.component';
import { CartPageComponent } from './main/cart-page/cart-page.component';
import { ContactComponent } from './main/contact/contact.component';
import { ManagerComponent } from './main/manager/manager.component';
import { ProductManagerComponent } from './main/manager/product-manager/product-manager.component';
import { UserManagerComponent } from './main/manager/user-manager/user-manager.component';
import { SettingsComponent } from './main/settings/settings.component';
import { AccountComponent } from './main/settings/account/account.component';
import { OrderManagerComponent } from './main/manager/order-manager/order-manager.component';
import { OrdersComponent } from './main/settings/orders/orders.component';
import { CategoryManagerComponent } from './main/manager/category-manager/category-manager.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'authentication', component: UserAuthComponent },
  { path: 'about', component: AboutComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'details/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartPageComponent, canActivate: [CartGuard, AuthGuard] },
  { path: 'contact', component: ContactComponent },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [LoginGuard],
    children: [
      { path: '', component: AccountComponent },
      { path: 'orders', component: OrdersComponent },
    ]
  },
  {
    path: 'manager',
    component: ManagerComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: '/manager/products', pathMatch: 'full' },
      { path: 'products', component: ProductManagerComponent },
      { path: 'products/:id', component: ProductDetailsComponent },
      // { path: 'users', component: UserManagerComponent },
      // { path: 'orders', component: OrderManagerComponent },
      { path: 'categories', component: CategoryManagerComponent }

    ]
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
