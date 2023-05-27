import {
  Component,
  OnInit,
} from '@angular/core';

import { Path } from '../../../config';
import { StoresModel } from '../../../models/stores.model';
import { StoresService } from '../../../services/stores.service';

@Component({
  selector: 'app-home-brands',
  templateUrl: './home-brands.component.html',
  styleUrls: ['./home-brands.component.css']
})
export class HomeBrandsComponent implements OnInit {
  path:string = Path.url;
  storeModel: StoresModel;
  /*=============================================
	Variable para almacenar la data de la tienda
	=============================================*/
	stores:any[]=[];
  /*=============================================
  Variable para capturar el ID de la tienda
  =============================================*/
  constructor(private storesService:StoresService,) {
  this.storeModel = new StoresModel();}
  preload:boolean = false;

  ngOnInit() {
    this.preload = true;
    let getStores:any = [];
    this.storesService.getData().subscribe(resp=>{
      this.stores=resp
    })
    this.preload = false;
  }

}
