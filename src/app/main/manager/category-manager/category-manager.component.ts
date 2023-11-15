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

  constructor(private categorySrv: CategoryService,
    private builder: FormBuilder,
    private toastr: ToastrService) {
    this.categorySrv.getAllCategory();
  }

  categoryForm = this.builder.group({
    _id: this.builder.control(''),
    name: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(1000)])),
    description: ''
  })

  ngOnInit(): void {
    this.categorySrv.categoriesEmit.subscribe(categories => {
      this.categories = categories;
    })
  }

  createCategory = async () => {
    if (this.categoryForm.valid) {
      const isCreated = await this.categorySrv.createCategory(this.categoryForm);

      if (isCreated)
        this.categoryForm.reset();

    } else {
      this.isError = true;
    }
  }

  getCategory(item: Category) {
    this.categoryForm.setValue({
      _id: item._id || '',
      name: item.name,
      description: item.description || ''
    });
    this.formType = 'Edit'
  }

  updateCategory = async () => {
    if (this.categoryForm.valid) {
      const result = await this.categorySrv.updateCategory(this.categoryForm);

      if (result) {
        this.categoryForm.reset();
        this.formType = '';
      }
    } else {
      this.isError = true;
    }
  }

  removeProduct(item: Category) {
    this.categorySrv.deleteCategory(item._id!);
  }
}
