import { Component, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    this.productSrv.GetProducts();
    this.productSrv.productsEmit.subscribe(result => {
      this.productList = result;
    })
  }

  singleAddToCart(item: Product) {
    // this.cartSrv.singleAddToCart(item);
  }

  constructor(private productSrv: ProductService, private cartSrv: CartService) { }

}
