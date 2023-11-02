import { Component, OnInit, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { User } from '../models/user';
import { UserAuthService } from '../services/user-auth.service';
import { CartService } from '../services/cart.service';
import { FilterService } from '../services/filter.service';
import { CartItem } from '../models/data-types';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userData: User | undefined;
  cartQuantity = 0;
  isSearchArea = false;
  productsFilter: Product[] = [];
  isSearch = false;

  ngOnInit(): void {
    const user = this.userSrv.GetLocalUser();
    const localCart: CartItem[] = this.cartSrv.getLocalCart();

    this.cartQuantity = localCart?.length | this.cartQuantity;

    if (user) {
      this.userData = user;
    }

    this.userSrv.userEmit.subscribe(data => {
      this.userData = data;
    })

    this.cartSrv.cartEmit.subscribe(cart => {
      this.cartQuantity = cart.length;
    })

  }

  constructor(private router: Router, private productSrv: ProductService, private userSrv: UserAuthService,
    private filterSrv: FilterService, private cartSrv: CartService, private authSrv: AuthService) { }

  logout() {
    this.authSrv.handleLogout();
    this.router.navigate(['']);
  }

  showSearchArea() {
    if (!this.isSearchArea) {
      this.isSearchArea = true;
    } else {
      this.isSearchArea = false;
      this.isSearch = false;
      this.productsFilter = [];
    }
  }

  onChangeSearch(event: Event) {
    let keySearch = (event.target as HTMLInputElement).value;
    if (keySearch.length > 0) {
      this.isSearch = true;
      const queryString = 'name=' + '/^' + keySearch + '/';
      this.filterSrv.filterProduct(queryString).subscribe(products => {
        this.productsFilter = products.data;
      })
    } else {
      this.isSearch = false;
    }
  }
}
