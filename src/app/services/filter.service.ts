import { HttpClient } from '@angular/common/http';
import { Serializer } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';
import { ServerData } from '../models/serverData';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private urlAPI = 'http://localhost:8081/v1/api/';

  constructor(private router: Router, private serializer: UrlSerializer, private http: HttpClient) { }

  filterProduct(queryString: string) {
    return this.http.get<ServerData>(this.urlAPI + 'products?' + queryString);
  }

  BuildQueryString(queryParams: Object) {
    const tree = this.router.createUrlTree([], { queryParams });
    console.log(this.serializer.serialize(tree)); // "/?foo=a&bar=42"
  }
}
