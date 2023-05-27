import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Path } from '../../../config';
import {
  DinamicPrice,
  DinamicRating,
  DinamicReviews,
  Rating,
} from '../../../functions';
import { ProductsService } from '../../../services/products.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-product-right',
  templateUrl: './product-right.component.html',
  styleUrls: ['./product-right.component.css']
})
export class ProductRightComponent implements OnInit {
  	path:string = Path.url;
  	products:any[] = [];
  	rating:any[] = [];
  	reviews:any[] = [];
    getProduct:any[] = [];
  	price:any[] = [];
  	render:boolean = true;
  	preload:boolean = false;
  	constructor(private activateRoute: ActivatedRoute,
  		        private productsService: ProductsService, private usersService: UsersService) { }
  	ngOnInit(): void {
  		this.preload = true;
  		this.productsService.getFilterData("url", this.activateRoute.snapshot.params["param"]) 
  		.subscribe( resp => {
  			for(const i in resp){
  				this.productsService.getFilterData("store", resp[i].store)
  				.subscribe( resp => {
  					this.productsFnc(resp);
  				})
  			}
  		})
  	}
  	/*=============================================
	Declaramos función para mostrar los productos recomendados
	=============================================*/
  	productsFnc(response:any){
  		this.products = [];
		/*=============================================
		Hacemos un recorrido por la respuesta que nos traiga el filtrado
		=============================================*/
  		let i;
  		this.getProduct = [];
  		for(i in response){
			this.getProduct.push(response[i]);
		}
	  	/*=============================================
		Ordenamos de mayor a menor ventas el arreglo de objetos
		=============================================*/
		this.getProduct.sort(function(a,b){
			return (b.sales - a.sales)
		})
		/*=============================================
		Filtramos el producto
		=============================================*/
		this.getProduct.forEach((product, index)=>{
			if(index < 4){
				this.products.push(product);
				 /*=============================================
	        	Rating y Review
	        	=============================================*/
	        	this.rating.push(DinamicRating.fnc(this.products[index]));
	        	this.reviews.push(DinamicReviews.fnc(this.rating[index]));
	        	/*=============================================
	        	Price
	        	=============================================*/
	        	this.price.push(DinamicPrice.fnc(this.products[index]));
				this.preload = false;
			}
		})
	}
	callback(){
  		if(this.render){
  			this.render = false;
  			Rating.fnc();
  		}
	}
/*=============================================
	Función para agregar productos a la lista de deseos
	=============================================*/
	addWishlist(product:any){
		this.usersService.addWishlist(product);
	}
}
