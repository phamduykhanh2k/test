import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartItem, ToTalSumary, Voucher } from 'src/app/models/data-types';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { CartService } from 'src/app/services/cart.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { VoucherService } from 'src/app/services/voucher.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  user: User;
  vouchers: Voucher[] = [];
  cart: CartItem[] = [];
  totalSumary!: ToTalSumary;
  quantity = 1;
  isVisibleModalVoucher = false;

  isApply = false;
  voucher: Voucher;
  selectedVoucher = '';
  inputCode = '';

  constructor(
    private cartSrv: CartService,
    private router: Router,
    private userSrv: UserAuthService,
    private voucherSrv: VoucherService,
    private toastr: ToastrService) { }

  async ngOnInit(): Promise<void> {
    const localCart = this.cartSrv.getLocalCart();
    const localVoucher = this.voucherSrv.getLocalVoucher();

    this.user = this.userSrv.GetLocalUser()!;
    let vouchers: Voucher[] = await this.voucherSrv.getVoucherHasFilter();
    let currentDate = new Date();
    this.vouchers = vouchers.map(voucher => ({
      ...voucher,
      statusExpired: new Date(voucher.expired_date) < currentDate ? 'Hết hạn sử dụng' : 'Còn hạn'
    }))

    if (localCart.length > 0) {
      this.cart = localCart;

      if (localVoucher) {
        this.voucher = localVoucher;
        this.selectedVoucher = localVoucher.code;
        this.totalSumary = this.cartSrv.processTotalSumary(localCart, localVoucher.discount);
      } else {
        this.voucher = this.vouchers[0];
        this.selectedVoucher = '';
        this.totalSumary = this.cartSrv.processTotalSumary(localCart);
        console.log(this.voucher);

      }
    }
  }

  onchangeQuantity = (event: Event, index: number) => {
    const quantity = (event.target as HTMLInputElement).value;
    this.cart[index].quantity = +quantity;
  }

  onUpdateCart = () => {
    let cart = this.cartSrv.updateCart(this.cart);
    if (cart) {
      this.cart = cart;
      let discount = this.voucherSrv.getLocalVoucher()?.discount;
      this.totalSumary = this.cartSrv.processTotalSumary(this.cart, discount);
    }
  }

  handleRemoveItemToCart = (index: number) => {
    let newCart = this.cartSrv.removeItemtoCart(index);
    const localVoucher = this.voucherSrv.getLocalVoucher();

    if (newCart) {
      this.cart = newCart;
      this.totalSumary = this.cartSrv.processTotalSumary(newCart, localVoucher?.discount);
    }
  }

  onToCheckOut = (cart: CartItem[]) => {
    const isValid = this.cartSrv.isValidQuantityByCart(cart);

    if (isValid)
      this.router.navigate(['/checkout']);
  }

  onApplyVoucher = async (voucherCode: string) => {
    let data = {
      type: 'APPLY-VOUCHER',
      code: voucherCode,
      userId: this.user._id
    }

    let voucher = await this.voucherSrv.applyVoucher(data);

    if (voucher) {
      this.totalSumary = this.cartSrv.processTotalSumary(this.cart, voucher.discount);
      this.voucher = voucher;
      this.inputCode = '';
      this.selectedVoucher = voucherCode;
      this.toastr.success('Mã khuyến mãi đã được áp dụng');
    }
  }

  onCancelApplyVoucher = () => {
    this.totalSumary = this.cartSrv.processTotalSumary(this.cart);
    localStorage.removeItem('voucher');
    this.selectedVoucher = '';
  }

  onChangeModalVoucher = () => {
    if (this.isVisibleModalVoucher === false) {
      this.isVisibleModalVoucher = true;
    } else {
      this.isVisibleModalVoucher = false;
    }
  }
}
