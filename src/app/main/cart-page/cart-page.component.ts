import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { TotalSumary } from 'src/app/models/totalSumary';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  productList: Product[] | undefined;
  totalSumary: TotalSumary = {
    total: 0,
    subTotal: 0,
    shipCost: 0
  };
  isCheckError = false;

  deliveryForm = this.builder.group({
    fullname: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(80)])),
    phoneNumber: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(13)])),
    address: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(10)])),
    status: this.builder.control('', Validators.required),
    note: ''
  })

  ngOnInit(): void {
    const products = this.cartSrv.getCart();
    const shipCost = 0;
    const totalSumary = this.cartSrv.getTotalSumary(products, shipCost);

    this.totalSumary = totalSumary;
    this.productList = products;

    this.cartSrv.totalSumaryEmit.subscribe(v => {
      this.totalSumary = v;
    })

  }

  removeItemCart(itemId: string) {
    this.cartSrv.localRemoveItemCart(itemId);
    this.productList = this.cartSrv.getCart();
    this.toastr.success('Bạn đã loại 1 sản phẩm')
  }

  handleQuantity(type: string, indexItem: number) {
    this.cartSrv.changeQuantity(type, indexItem);
  }

  checkOut() {
    if (this.deliveryForm.valid) {
      const userData = this.userSrv.GetLocalUser()!;
      const deliveryData = this.deliveryForm.value;
      const totalSumaryData = this.totalSumary;
      const products = this.productList!;

      this.orderSrv.AddOrder(userData, deliveryData, totalSumaryData, products);


    } else {
      this.isCheckError = true;
      this.toastr.error('Dữ liệu nhập vào từ 10 ký tự trở lên', 'Dữ liệu nhập vào không hợp lệ')
    }
  }

  constructor(private productSrv: ProductService, private toastr: ToastrService,
    private userSrv: UserAuthService,
    private orderSrv: OrderService, private router: Router, private builder: FormBuilder, private cartSrv: CartService) { }

}
