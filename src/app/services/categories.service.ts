import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs';

import { Api } from '../config';
import { Icategories } from '../interfaces/Icategories';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private api:string = Api.url;

  constructor(private http:HttpClient) { }
  getData(){
    return this.http.get<{[id: string]:Icategories}>(`${this.api}categories.json`).pipe(map(categories=>{
      let  categoriesData: Icategories[] = [];
      for(let id in categories){
        categoriesData.push({...categories[id], id})
      }
      return categoriesData;
    }))
}

getFilterData(orderBy: string, equalTo: string){
  return this.http.get(`${this.api}categories.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`)
}
patchData(id:string, value:object){
  return this.http.patch(`${this.api}categories/${id}.json`,value);
}
}
