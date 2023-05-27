import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs';

import { Api } from '../config';
import { Istores } from '../interfaces/Istores';
import { StoresModel } from '../models/stores.model';

@Injectable({
  providedIn: 'root'
})
export class StoresService {
  private api:string = Api.url;

constructor(private http:HttpClient) { }
getData(){
  return this.http.get<{[id: string]:Istores}>(`${this.api}stores.json`).pipe(map(stores=>{
    let  storesData: Istores[]= [];
    for(let id in stores){
      storesData.push({...stores[id], id})
    }
    return storesData;
  }))
}

getFilterData(orderBy: String, equalTo: String){
  return this.http.get<{[id: string]:Istores}>(`${this.api}stores.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`).pipe(map((storesfilter:any)=>{
    let  storesFilterData:Istores[]= [];
    for(let id in storesfilter){
    storesFilterData.push({...storesfilter[id],id})
    }
    return storesFilterData;
  }))
}
/*=============================================
	Registro en Firebase Database
	=============================================*/
	registerDatabase(body: StoresModel, idToken:string){
		return this.http.post(`${this.api}/stores.json?auth=${idToken}`, body);
	}
	/*=============================================
	Actualizar en Firebase Database
	=============================================*/
	patchDataAuth(id:string, value:StoresModel, idToken:string){
		return this.http.patch(`${this.api}stores/${id}.json?auth=${idToken}`,value);
	}
}
