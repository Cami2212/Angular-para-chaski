import {
  Component,
  OnInit,
} from '@angular/core';

import { ProductsService } from 'src/app/services/products.service';

import { Path } from '../../../config';

@Component({
  selector: 'app-home-promotions',
  templateUrl: './home-promotions.component.html',
  styleUrls: ['./home-promotions.component.css']
})
export class HomePromotionsComponent implements OnInit {
  path:string = Path.url
  idproduct:any;
  preload:boolean=false;
  banner_promotions:any[]=[]
  category:any[]=[]
  url:any[]=[]
  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.preload= true;
    this.productsService.getData()
        .subscribe(resp =>{

          let index
          let size = Object.keys(resp).length;
          if (size > 2){
            index = Math.floor(Math.random()*(size-2));
          }
          else{
            index =size-2
          }
          this.productsService.getLimitData(Object.keys(resp)[index], 2).subscribe(resp=>{
          for(let i in resp){
            this.banner_promotions.push(resp[i].default_banner)
            this.category.push((resp[i].category))
            this.url.push((resp[i].url))
            this.preload=false;
          }
        })
      })
  }

}
