import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AboutComponent } from './main/about/about.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { BannerComponent } from './main/home/banner/banner.component';
import { ProductComponent } from './main/home/product/product.component';
import { ShopBannerComponent } from './main/home/shop-banner/shop-banner.component';
import { UserAuthComponent } from './main/user-auth/user-auth.component';
import { ShopComponent } from './main/shop/shop.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductDetailsComponent } from './main/product-details/product-details.component';
import { HomeComponent } from './main/home/home.component';
import { PageNotFoundComponent } from './main/page-not-found/page-not-found.component';
import { CartPageComponent } from './main/cart-page/cart-page.component';
import { ContactComponent } from './main/contact/contact.component';
import { SaleBannerComponent } from './main/sale-banner/sale-banner.component';
import { ManagerComponent } from './main/manager/manager.component';
import { ProductManagerComponent } from './main/manager/product-manager/product-manager.component';
import { UserManagerComponent } from './main/manager/user-manager/user-manager.component';
import { SettingsComponent } from './main/settings/settings.component';
import { AccountComponent } from './main/settings/account/account.component';
import { OrderManagerComponent } from './main/manager/order-manager/order-manager.component';
import { OrdersComponent } from './main/settings/orders/orders.component';
import { CategoryManagerComponent } from './main/manager/category-manager/category-manager.component';
import { OrderDetailComponent } from './main/order-detail/order-detail.component';
import { CheckoutComponent } from './main/checkout/checkout.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { AuthInterceptor } from './core/auth.interceptor';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { FeedbacksComponent } from './main/settings/feedbacks/feedbacks.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    BannerComponent,
    ProductComponent,
    ShopBannerComponent,
    AboutComponent,
    UserAuthComponent,
    ShopComponent,
    ProductDetailsComponent,
    HomeComponent,
    PageNotFoundComponent,
    CartPageComponent,
    ContactComponent,
    SaleBannerComponent,
    ManagerComponent,
    ProductManagerComponent,
    UserManagerComponent,
    SettingsComponent,
    AccountComponent,
    OrderManagerComponent,
    OrdersComponent,
    CategoryManagerComponent,
    OrderDetailComponent,
    CheckoutComponent,
    FeedbacksComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzIconModule,
    NzDrawerModule,
    NzRadioModule,
    NzTagModule,
    NzModalModule,
    NzRateModule,
    NzCommentModule,
    NzAvatarModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
