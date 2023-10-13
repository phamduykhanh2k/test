import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable, Observer, Subject, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { ServerData } from '../models/serverData';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  userData = new EventEmitter<User | undefined>();

  constructor(private http: HttpClient, private router: Router, private toasr: ToastrService) { }

  GetAll() {
    return this.http.get('http://localhost:8081/v1/api/users');
  }

  SignUp(data: any): Observable<boolean> {
    var subject = new Subject<boolean>();

    this.checkUsername(data.username).subscribe(result => {
      if (result) {
        subject.next(false);
      } else {
        this.http.post<ServerData>('http://localhost:8081/v1/api/users', data).subscribe(result => {
          subject.next(true);
        });
      }
    });
    return subject.asObservable();
  }

  LoggedIn(data: any): Observable<boolean> {
    var subject = new Subject<boolean>();

    this.http.post<ServerData>('http://localhost:8081/v1/api/users', data).subscribe(result => {
      const user: User | undefined = result.data.at(0);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.userData.emit(user);
        subject.next(true);
      } else {
        subject.next(false);
      }
    });

    return subject.asObservable();
  }

  UpdateUser(data: any): Observable<boolean> {
    let subject = new Subject<boolean>();

    this.http.put<ServerData>('http://localhost:8081/v1/api/users', data).subscribe(result => {
      if (result.data) {
        localStorage.setItem('user', JSON.stringify(data));
        this.userData.emit(data);
        subject.next(true);
      } else {
        this.userData.emit();
        subject.next(false);
      }
    });

    return subject.asObservable();
  }

  GetLocalUser() {
    let localUser = localStorage.getItem('user') != null ? localStorage.getItem('user') : undefined;

    if (localUser) {
      let user: User = JSON.parse(localUser);
      return user;
    }
    return null;
  }

  Logout() {
    localStorage.clear();
    this.userData.emit(undefined);
  }

  private checkUsername(username: string): Observable<boolean> {
    let subject = new Subject<boolean>();

    this.http.get<ServerData>('http://localhost:8081/v1/api/users?username=' + username).subscribe(result => {
      if (result.data.length > 0) {
        subject.next(true);
      } else {
        subject.next(false);
      }
    })
    return subject.asObservable();
  }
}
