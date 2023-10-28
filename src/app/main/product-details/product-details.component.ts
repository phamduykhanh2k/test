import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  quantity = 1;
  removeCart = false;

  constructor(private productSrv: ProductService, private activeRoute: ActivatedRoute,
    private router: Router, private cartSrv: CartService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      const productId = params['id'];

      this.productSrv.GetProductById(productId).subscribe(res => {
        const product = res.data;
        this.product = product;
      })
    })
  }

  addToCart() {
    const isAddItem = this.cartSrv.addItemToCart(this.product!, this.quantity);

    if (!isAddItem)
      this.router.navigate(["authentication"]);
  }
}
