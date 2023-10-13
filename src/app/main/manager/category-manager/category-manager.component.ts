import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.css']
})
export class CategoryManagerComponent implements OnInit {
  page: number = 1;
  formType: string = '';
  isError = false;
  categories: Category[] = [];

  constructor(private categorySrv: CategoryService, private builder: FormBuilder, private toastr: ToastrService) { }

  categoryForm = this.builder.group({
    id: '',
    name: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(1000)])),
    description: ''
  })

  ngOnInit(): void {
    this.categorySrv.getCategories();
    this.categorySrv.categories.subscribe(categories => {
      this.categories = categories;
    })
  }

  createCategory() {
    if (this.categoryForm.valid) {
      this.categorySrv.createCategory(this.categoryForm.value).subscribe(result => {
        if (result) {
          this.categoryForm.reset();
          this.toastr.success('Thêm danh mục thành công');
        } else {
          this.toastr.warning('Tên danh mục đã tồn tại');
        }
      });
    } else {
      this.isError = true;
    }
  }

  getCategory(item: Category) {
    this.categoryForm.setValue({
      id: item._id || '',
      name: item.name,
      description: item.description || ''
    });
    this.formType = 'Edit'
  }

  updateCategory() {
    if (this.categoryForm.valid) {
      this.categorySrv.updateCategory(this.categoryForm.value).subscribe(result => {
        if (result) {
          this.categoryForm.reset();
          this.formType = '';
          this.toastr.success('Sửa danh mục thành công');
        } else {
          this.toastr.warning('Tên danh mục đã tồn tại');
        }
      });
    } else {
      this.isError = true;
    }
  }

  removeProduct(item: Category) {
    this.categorySrv.deleteCategory(item._id!).subscribe(result => {
      if (result) {
        this.toastr.success('Xóa thành công');
      } else {
        this.toastr.warning('Có lẽ hệ thống đang gặp sự cố', 'Sửa thất bại');
      }
    });
  }
}
