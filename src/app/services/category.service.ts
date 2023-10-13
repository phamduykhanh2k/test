import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { ServerData } from '../models/serverData';
import { Category } from '../models/category';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url: string = 'http://localhost:8081/v1/api/categories/'
  categories = new EventEmitter<Category[]>();

  constructor(private http: HttpClient) { }

  getCategories() {
    this.http.get<ServerData>(this.url).subscribe(result => {
      this.categories.emit(result.data);
    });
  }

  createCategory(data: any): Observable<boolean> {
    let subject = new Subject<boolean>();

    this.http.post<ServerData>(this.url, data).subscribe(result => {
      if (result.data) {
        this.getCategories();
        subject.next(true);
      } else {
        subject.next(false);
      }
    })
    return subject.asObservable();
  }

  updateCategory(data: any): Observable<boolean> {
    let subject = new Subject<boolean>();

    this.http.put<ServerData>(this.url, data).subscribe(result => {
      if (result.data) {
        this.getCategories();
        subject.next(true);
      } else {
        subject.next(false);
      }
    })
    return subject.asObservable();
  }

  deleteCategory(id: string) {
    let subject = new Subject<boolean>();
    this.http.delete<ServerData>(this.url + id).subscribe(result => {
      const data: any = result.data;
      if (data.modifiedCount > 0) {
        subject.next(true)
        this.getCategories();
      } else {
        subject.next(false);
      }
    });
    return subject.asObservable();
  }
}
