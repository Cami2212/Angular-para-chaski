import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Path } from '../../../config';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-call-to-action',
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.css']
})
export class CallToActionComponent implements OnInit {

  path:string = Path.url;
  call_to_action:any[] = [];
  price:any[] = [];

constructor(private activateRoute: ActivatedRoute, private productsService: ProductsService) { }

ngOnInit(): void {
  this.productsService.getFilterData("url",  this.activateRoute.snapshot.params["param"])
  		.subscribe( resp => {
  			for(const i in resp){
  				this.call_to_action.push(resp[i])
  				this.call_to_action.forEach(response=>{
	  				let type;
			        let value;
			        let offer;
					let offerDate;
					let disccount=""
        			let today = new Date();
			        if(response.offer != ""){
						offerDate = new Date(

							parseInt(JSON.parse(response.offer)[2].split("-")[0]),
							parseInt(JSON.parse(response.offer)[2].split("-")[1]) - 1,
							parseInt(JSON.parse(response.offer)[2] .split("-")[2])
				
						)
			            type = JSON.parse(response.offer)[0];
			            value = JSON.parse(response.offer)[1];
						if (today < offerDate) {
			            if(type == "Disccount"){
			              offer = (response.price-(response.price * value/100)).toFixed(2)
			            }
			            if(type == "Fixed"){
			                offer = Number(value)
			            }
			            this.price.push(`<span class="ps-product__price">
					                        <span>$${Number(offer).toFixed(2)}</span>
					                        <del>$${Number(response.price).toFixed(2)}</del>
					                    </span>`)
						}else{
							this.price.push(`<span class="ps-product__price">
					                        <span>$${response.price}</span>
					                    </span>`)
						}
									}else{
			            this.price.push(`<span class="ps-product__price">
					                        <span>$${response.price}</span>
					                    </span>`)
			        }
		        })
  			}
  		})
  	}
}

