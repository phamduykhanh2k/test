import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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

  productForm = this.builder.group({
    id: '',
    name: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(1000)])),
    image: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(10)])),
    quantity: this.builder.control(0, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(10), Validators.min(1)])),
    price: this.builder.control(0, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.min(500)])),
    categories: this.builder.control('', Validators.required),
    description: ''
  })

  constructor(private productSrv: ProductService, private builder: FormBuilder,
    private toastr: ToastrService, private router: Router, private categorySrv: CategoryService) { }

  ngOnInit(): void {
    // Lấy danh sách danh mục sản phẩm
    this.categorySrv.getCategories();
    this.categorySrv.categories.subscribe(result => {
      this.categories = result;
    })

    // Lấy danh sách sản phẩm
    this.productSrv.GetProducts();
    this.productSrv.productsEmit.subscribe(result => {
      this.products = result;
    })
  }

  createdProduct() {
    if (this.productForm.valid) {

      console.warn(this.productForm.value)
      this.productSrv.CreateProduct(this.productForm.value).subscribe(result => {
        if (result) {
          this.productForm.reset();
          this.toastr.success('Thêm thành công');
        } else {
          this.toastr.warning('Có vẻ hệ thống đang gặp sự cố', 'Thêm thất bại');
        }
      })
    } else {
      this.isError = true;
    }
  }

  getProduct(item: Product) {
    this.productForm.setValue({
      id: item._id,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
      categories: item.categories,
      description: item.description
    });

    this.formType = 'Edit';
  }

  updateProduct() {
    if (this.productForm.valid) {
      this.productSrv.UpdateProduct(this.productForm.value).subscribe(result => {
        if (result) {
          this.productForm.reset();
          this.formType = '';
          this.toastr.success('Sửa thành công');
        } else {
          this.toastr.warning('Có vẻ hệ thống đang gặp sự cố', 'Sửa thất bại');
        }
      })
    } else {
      this.isError = true;
    }
  }

  deleteProduct(item: Product) {
    this.productSrv.DeleteProduct(item._id).subscribe(result => {
      console.warn(result)
    })
  }
}
