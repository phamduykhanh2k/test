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
  productQuantiy = 1;
  removeCart = false;

  constructor(private productSrv: ProductService, private activeRoute: ActivatedRoute,
    private router: Router, private toastr: ToastrService, private cartSrv: CartService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      let productId = params['id'];
      this.productSrv.GetProductById(productId).subscribe(result => {
        this.product = result.data.at(0);
      })
    })
  }

  handleQuantity(type: string) {
    if (this.product) {
      if (this.productQuantiy < this.product.quantity && type === 'plus') {
        this.productQuantiy += 1;
      } else if (this.productQuantiy > 1 && type === 'min') {
        this.productQuantiy -= 1;
      } else if (this.productQuantiy >= this.product.quantity && type === 'plus') {
        this.toastr.warning('Vui lòng liên hệ cửa hàng để đặt sản phẩm', 'Sản phẩm không đủ')
      }
    }
  }

  addToCart() {
    // if (this.product) {
    //   this.product.cartQuantity = this.productQuantiy;
    //   if (localStorage.getItem('user')) {
    //     this.cartSrv.localAddToCart(this.product);
    //   } else {
    //     this.toastr.warning('Vui lòng đăng nhập để mua sản phẩm')
    //     this.router.navigate(['/authentication']);
    //   }
    // }
  }
}
