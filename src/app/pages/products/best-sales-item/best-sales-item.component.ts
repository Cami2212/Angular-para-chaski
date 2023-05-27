import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { Path } from '../../../config';
import {
  CarouselNavigation,
  DinamicPrice,
  DinamicRating,
  DinamicReviews,
  OwlCarouselConfig,
  Rating,
} from '../../../functions';
import { ProductsService } from '../../../services/products.service';
import { UsersService } from '../../../services/users.service';

declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-best-sales-item',
  templateUrl: './best-sales-item.component.html',
  styleUrls: ['./best-sales-item.component.css']
})
export class BestSalesItemComponent implements OnInit {
	path:string = Path.url;
	bestSalesItem:any[] = [];
	render:boolean = true;
	rating:any[] = [];
	reviews:any[] = [];
	price:any[] = [];
	preload:boolean = false;
  getSales:any[] = [];
  placeholder:any[] = [0,1,2,3,4,5];
  	constructor(private productsService: ProductsService, private activateRoute: ActivatedRoute, private usersService: UsersService, private router:Router) { }
  	ngOnInit(): void {
  		this.preload = true;
  		/*=============================================
		Capturamos el parámetro URL
		=============================================*/
		let params = this.activateRoute.snapshot.params["param"].split("&")[0];
		/*=============================================
		Filtramos data de productos con categorías
		=============================================*/
		this.productsService.getFilterData("category", params)
		.subscribe(resp1=>{
			if(Object.keys(resp1).length > 0){
				this.productsFnc(resp1);
			}else{
				/*=============================================
				Filtramos data de subategorías
				=============================================*/
				this.productsService.getFilterData("sub_category", params)
				.subscribe(resp2=>{
					this.productsFnc(resp2);
				})
			}
		})
	}
	/*=============================================
	Declaramos función para mostrar las mejores ventas
	=============================================*/
	productsFnc(response:any){
  		this.bestSalesItem = [];
		/*=============================================
		Hacemos un recorrido por la respuesta que nos traiga el filtrado
		=============================================*/
  		for(let i in response){
			this.getSales.push(response[i]);
		}
		/*=============================================
		Ordenamos de mayor a menor ventas el arreglo de objetos
		=============================================*/
    this.getSales.sort(function(a,b){
			return (b.sales - a.sales)
		})
		/*=============================================
		Filtramos solo hasta 10 productos
		=============================================*/
    	this.getSales.forEach((product, index)=>{
			if(index < 10){
				this.bestSalesItem.push(product);
				this.rating.push(DinamicRating.fnc(this.bestSalesItem[index]));
				this.reviews.push(DinamicReviews.fnc(this.rating[index]));
        setTimeout(function(){
          Rating.fnc();
        },index*100)
				this.price.push(DinamicPrice.fnc(this.bestSalesItem[index]));
				this.preload = false;
			}
		})
}
	/*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/
	callback(){
		if(this.render){
			this.render = false;
			OwlCarouselConfig.fnc();
			CarouselNavigation.fnc();

		}
	}
	/*=============================================
	Función para agregar productos a la lista de deseos
	=============================================*/
	addWishlist(product:any){
		this.usersService.addWishlist(product);
	}
	/*=============================================
	Función para agregar productos al carrito de compras
	=============================================*/
	addShoppingCart(product:any, quantity: any, details:any){
		let url = this.router.url;
		let item = {
			product: product,
			unit: quantity,
			details: details,
			url: url
		}
		this.usersService.addSoppingCart(item);
	}
}
