import { HttpClient } from '@angular/common/http';
import { Serializer } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';
import { ServerData } from '../models/serverData';
import { ObservableService } from './observable.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private urlAPI = 'http://localhost:8081/v1/api/';

  constructor(private router: Router, private serializer: UrlSerializer, private http: HttpClient, private observableSrv: ObservableService) { }

  filter = async (queryString: string) => {
    const observable = await this.http.get<ServerData>(this.urlAPI + queryString);
    return this.observableSrv.getValueFromObservable(observable);
  }

  BuildQueryString(queryParams: Object) {
    const tree = this.router.createUrlTree([], { queryParams });
    return this.serializer.serialize(tree).split('/')[2];
  }
}
