import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category';
import { FilterService } from 'src/app/services/filter.service';
import { query } from '@angular/animations';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  productList: Product[] = [];
  categories: Category[] = [];
  page: number = 1;
  cateChoosed: String = "";

  constructor(
    private productSrv: ProductService,
    private toastr: ToastrService,
    private router: Router,
    private cartSrv: CartService,
    private categorySrv: CategoryService,
    private FilterSrv: FilterService) {

    this.categorySrv.getAllCategory();
    this.productSrv.getAllProduct();
  }

  ngOnInit(): void {
    this.categorySrv.categoriesEmit.subscribe(result => {
      this.categories = result;
    })

    this.productSrv.productsEmit.subscribe(result => {
      this.productList = result;
    })
  }



  singleAddToCart(item: Product) {
    const isAdd = this.cartSrv.addItemToCart(item, 1);

    if (!isAdd)
      this.router.navigate(["authentication"]);
  }

  filter = async (id: string) => {
    this.cateChoosed = id;
    let result = await this.productSrv.handleFilterProductByCategory(id);

    if (result && result.EC === 0) {
      this.productList = result.data;
    }
  }
}
