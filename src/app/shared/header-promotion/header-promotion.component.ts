import {
  Component,
  OnInit,
} from '@angular/core';

import { Path } from '../../config';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-header-promotion',
  templateUrl: './header-promotion.component.html',
  styleUrls: ['./header-promotion.component.css']
})
export class HeaderPromotionComponent implements OnInit {
path:string = Path.url;
preload:boolean=false;
top_banner: any;
category:any;
url:any = null;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.preload= true;

    this.productsService.getData()
        .subscribe(resp =>{
           /*=============================================
			Tomar la longitud del objeto
			=============================================*/
          let size = Object.keys(resp).length;
          /*=============================================
			Generar un número aleatorio
			=============================================*/
          let  index = Math.floor(Math.random()*size);
          /*=============================================
			Devolvemos a la vista un banner aleatorio
			=============================================*/
          this.category = (Object.values(resp)[index]).category
          this.top_banner = (Object.values(resp)[index]).top_banner
          this.top_banner = JSON.parse(this.top_banner)
          this.url = resp[Object.keys(resp)[index]].url;
          let i = Object.keys(resp).map;
          this.preload=false;
      })
  }

}
