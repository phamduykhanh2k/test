import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { async } from 'rxjs';
import { Feedback } from 'src/app/models/data-types';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { FeedbackService } from 'src/app/services/feedback.service';
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
  feedbacks: Feedback[] = [];

  constructor(private productSrv: ProductService, private activeRoute: ActivatedRoute,
    private router: Router, private cartSrv: CartService, private feedbackSrv: FeedbackService) { }

  async ngOnInit(): Promise<void> {
    this.activeRoute.params.subscribe(async (params: Params) => {
      const id = params['id'];
      const product = await this.productSrv.getProduct(id);
      this.feedbacks = await this.feedbackSrv.getFeedbackByProductId(product._id);
      this.product = product;
    })
  }

  addToCart() {
    const isAddItem = this.cartSrv.addItemToCart(this.product!, this.quantity);

    if (!isAddItem)
      this.router.navigate(["authentication"]);
  }
}

