import {
  Component,
  OnInit,
} from '@angular/core';

import { ProductsService } from 'src/app/services/products.service';

import { Path } from '../../../config';
import {
  backgroundImage,
  OwlCarouselConfig,
} from '../../../functions.js';

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.css']
})
export class HomeBannerComponent implements OnInit {
path:string = Path.url
idproduct:any;
category:any[]=[]
url:any[]=[]
banner_home:any[]=[]
render:boolean=true
preload:boolean=false;
  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.preload= true;
    this.productsService.getData().subscribe(resp =>{

          let index
          let size = Object.keys(resp).length;
          if (size > 5){
            index = Math.floor(Math.random()*(size-5));
          }
          else{
            index =size-3
          }

          this.productsService.getLimitData(Object.keys(resp)[index], 5).subscribe(resp=>{
          for(let i in resp){
            this.banner_home.push(JSON.parse(resp[i].horizontal_slider))
            this.category.push((resp[i].category))
            this.url.push((resp[i].url))
            this.preload=false;
          }
        })
      })
  }

  callback(){
    if(this.render){
      this.render=false;
      OwlCarouselConfig.fnc()
    backgroundImage.fnc()
    }
  }

}
