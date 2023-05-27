import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Api } from '../config';

@Injectable({
  providedIn: 'root'
})
export class SubCategoriesService {

  private api:string = Api.url;
  constructor(private http:HttpClient) { }
  getFilterData(orderBy: any, equalTo: any){
    return this.http.get(`${this.api}sub-categories.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`)
  }
  patchData(id:string, value:object){
    return this.http.patch(`${this.api}sub-categories/${id}.json`,value);
  }
}
