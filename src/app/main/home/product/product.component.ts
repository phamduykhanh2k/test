import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  productList: Product[] | undefined;

  constructor(private productSrv: ProductService, private cartSrv: CartService, private router: Router) {
    this.productSrv.getAllProduct();
  }

  async ngOnInit(): Promise<void> {
    this.productSrv.productsEmit.subscribe(result => {
      this.productList = result;
    })
  }

  singleAddToCart(item: Product) {
    const isAdd = this.cartSrv.addItemToCart(item, 1);

    if (!isAdd)
      this.router.navigate(["authentication"]);
  }
}
