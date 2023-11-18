import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { ServerData } from '../models/serverData';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ObservableService {

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  private urlAPI = 'http://localhost:8081/v1/api/';

  public getValueFromObservable = async (observable: Observable<ServerData>) => {
    const promise = observable.pipe(take(1)).toPromise()
    const value = await promise.then((data => data)).catch((err) => {
      if (err.status === 401)
        this.toastr.error('Vui lòng đăng nhập', 'Token không hợp lệ');
    });
    return value;
  }

  getAll = (schemaName: string) => {
    const observable = this.http.get<ServerData>(this.urlAPI + schemaName, { withCredentials: true });
    return this.getValueFromObservable(observable);
  }

  get = (schemaName: string, _id: string) => {
    const observable = this.http.get<ServerData>(this.urlAPI + schemaName + '/' + _id, { withCredentials: true });
    return this.getValueFromObservable(observable);
  }

  post = (schemaName: string, data: any) => {
    const observable = this.http.post<ServerData>(this.urlAPI + schemaName, data, { withCredentials: true });
    return this.getValueFromObservable(observable);
  }

  update = (schemaName: string, data: any) => {
    const observable = this.http.put<ServerData>(this.urlAPI + schemaName, data, { withCredentials: true });
    return this.getValueFromObservable(observable);
  }

  delete = (schemaName: string, _id: string) => {
    const observable = this.http.delete<ServerData>(this.urlAPI + schemaName + '/' + _id, { withCredentials: true });
    return this.getValueFromObservable(observable);
  }

  login = async (data: any) => {
    const observable = this.http.post<ServerData>(this.urlAPI + 'login', data, { withCredentials: true });
    return this.getValueFromObservable(observable);
  }

  refreshToken = () => {
    return this.http.get<ServerData>(this.urlAPI + 'refreshToken', { withCredentials: true });
  }

  logout = async () => {
    const observable = this.http.get<ServerData>(this.urlAPI + 'logout', { withCredentials: true });
    return this.getValueFromObservable(observable);
  }
}
