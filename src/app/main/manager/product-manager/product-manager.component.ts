import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.css']
})
export class ProductManagerComponent implements OnInit {
  formType = '';
  isError = false;
  page: number = 1;
  products: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;

  constructor(private productSrv: ProductService, private builder: FormBuilder,
    private toastr: ToastrService, private router: Router, private categorySrv: CategoryService) {

    this.productForm = this.builder.group({
      _id: this.builder.control(''),
      name: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(250)])),
      image: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(10)])),
      quantity: this.builder.control(0, Validators.compose([Validators.required, Validators.min(1), Validators.max(9999)])),
      price: this.builder.control(0, Validators.compose([Validators.required, Validators.min(500), Validators.maxLength(2000000)])),
      categories: this.builder.control('', Validators.required),
      description: this.builder.control('')
    })

    this.categorySrv.getAllCategory();
    this.productSrv.getAllProduct();
  }

  ngOnInit(): void {
    this.categorySrv.categoriesEmit.subscribe(result => {
      this.categories = result;
    })

    this.productSrv.productsEmit.subscribe(result => {
      this.products = result;
    })
  }

  handleCreateProduct = async () => {
    if (this.productForm!.valid) {
      const isCreated = await this.productSrv.createProduct(this.productForm);
      if (isCreated) {
        this.productForm.reset();
      }
    } else {
      this.isError = true;
    }
  }

  getProduct(item: Product) {
    this.productForm.setValue({
      _id: item._id,
      name: item.name || '',
      image: item.image || '',
      quantity: item.quantity || '',
      price: item.price || '',
      categories: item.categories._id || '',
      description: item.description || ''
    });

    this.formType = 'Edit';
  }

  updateProduct = async () => {
    if (this.productForm.valid) {
      const isUpdated = await this.productSrv.updateProduct(this.productForm);

      if (isUpdated) {
        this.productForm.reset();
        this.formType = '';
      }
    } else {
      this.isError = true;
    }
  }

  deleteProduct = (item: Product) => {
    this.productSrv.deleteProduct(item._id!);
  }
}
