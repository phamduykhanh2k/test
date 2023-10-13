import { Component, OnInit, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { User } from '../models/user';
import { UserAuthService } from '../services/user-auth.service';
import { Cart } from '../models/cart';
import { CartService } from '../services/cart.service';
import { FilterService } from '../services/filter.service';

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

    if (user) {
      this.userData = user;
    }

    this.userSrv.userData.subscribe(data => {
      this.userData = data;
    })

    this.cartSrv.cartData.subscribe((items) => {
      let s = 0;
      items.forEach(item => {
        s += item.cartQuantity;
      });

      this.cartQuantity = s;
    })
  }

  constructor(private router: Router, private productSrv: ProductService, private userSrv: UserAuthService,
    private filterSrv: FilterService, private cartSrv: CartService) { }

  logout() {
    this.userSrv.Logout();
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
      const queryString = 'name=' + keySearch;
      this.filterSrv.filterProduct(queryString).subscribe(products => {
        this.productsFilter = products.data;
      })
    } else {
      this.isSearch = false;
    }
  }
}
