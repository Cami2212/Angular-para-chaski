import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs';

import { Api } from '../config';
import { Iproducts } from '../interfaces/Iproducts';
import { ProductsModel } from '../models/products.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private api:string = Api.url;

  constructor(private http:HttpClient) { }
    getData(){
      return this.http.get(`${this.api}products.json`).pipe(map((products:any)=>{
        let  productsData = [];
        let count =0
        for(let id in products){
          count++
          if(JSON.parse(products[id].feedback).type=="approved"){
          productsData.push(products[id])
          }
        }
            if(count==Object.keys(products).length){
              return productsData;
            }

      }))
    }
  getLimitData(startAt:string, limitToFirst:number){
    return this.http.get(`${this.api}products.json?orderBy="$key"&startAt="${startAt}"&limitToFirst=${limitToFirst}&print=pretty `).pipe(map((productsLimit:any)=>{
      let  productsDataLimit = [];
      let count =0
      for(let id in productsLimit){
        count++
        if(JSON.parse(productsLimit[id].feedback).type=="approved"){
        productsDataLimit.push(productsLimit[id])
        }
      }
      if(count==Object.keys(productsLimit).length){
        return productsDataLimit;
      }
    }))
  }

  getFilterData(orderBy: String, equalTo: String){
    return this.http.get(`${this.api}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`).pipe(map((productsFilter:any)=>{
      let  productsFilterData : Iproducts[]= [];
      let count = 0
      for(let id in productsFilter){
        count++
        if(JSON.parse(productsFilter[id].feedback).type=="approved"){
        productsFilterData.push({...productsFilter[id], id})
        }
      }
      if(count==Object.keys(productsFilter).length){
        return productsFilterData;
      }
    }))
  }
  getFilterData2(orderBy: String, equalTo: String){
    return this.http.get(`${this.api}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`)
  }

  getFilterDataWithLimit(orderBy:string, equalTo:string, limitToFirst:number){

		return this.http.get(`${this.api}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&limitToFirst=${limitToFirst}&print=pretty`).pipe(map((productsFilterLimit:any)=>{
    let  productsDataFilterLimit = [];
    let count = 0
    for(let id in productsFilterLimit){
      count++
        if(JSON.parse(productsFilterLimit[id].feedback).type=="approved"){
      productsDataFilterLimit.push(productsFilterLimit[id])
        }
    }

    return productsDataFilterLimit;

  }))
	}
  getFilterDataMyStore(orderBy:string, equalTo:string){
		return this.http.get(`${this.api}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);
	}
  getFilterDataStore(orderBy:string, equalTo:string){
		return this.http.get(`${this.api}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`)
	}
  getSearchData(orderBy:string, param:string){

		return this.http.get(`${this.api}products.json?orderBy="${orderBy}"&startAt="${param}"&endAt="${param}\uf8ff"&print=pretty`);

	}
  patchData(id:string, value:object){

		return this.http.patch(`${this.api}products/${id}.json`,value);
	}
  patchDataAuth(id:string, value:object, idToken:string){

		return this.http.patch(`${this.api}products/${id}.json?auth=${idToken}`,value);
	}
/*=============================================
  Tomar información de un solo usuario
  =============================================*/
	getUniqueData(value:string){
		return this.http.get(`${this.api}products/${value}.json`);
	}
  /*=============================================
	Registro en Firebase Database
	=============================================*/
	registerDatabase(body: ProductsModel, idToken:string){
		return this.http.post(`${this.api}/products.json?auth=${idToken}`, body);
	}
	/*=============================================
	Eliminar registro en Firebase
	=============================================*/
	deleteDataAuth(id:string, idToken:string){
		return this.http.delete(`${this.api}products/${id}.json?auth=${idToken}`);
	}
}
