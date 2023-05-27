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
  DinamicPrice,
  DinamicRating,
  DinamicReviews,
  Pagination,
  Rating,
  Select2Cofig,
  Tabs,
} from '../../../functions';
import { ProductsService } from '../../../services/products.service';
import { UsersService } from '../../../services/users.service';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-search-showcase',
  templateUrl: './search-showcase.component.html',
  styleUrls: ['./search-showcase.component.css']
})
export class SearchShowcaseComponent implements OnInit {

 	path:string = Path.url;
  	products:any[] = [];
  	render:boolean = true;
  	preload:boolean = false;
  	rating:any[] = [];
	reviews:any[] = [];
	price:any[] = [];
	params:any;
	page;
	productFound:number = 0;
	currentRoute:any;
	totalPage:number = 0;
	sort;
	sortItems:any[] = [];
	sortValues:any[] = [];
	properties:any[] = ["category","name","store","sub_category","tags","title_list","url"];
	listProducts:any[] = [];
  getProducts:any[] = [];

  	constructor(private productsService: ProductsService, private activateRoute: ActivatedRoute, private usersService: UsersService, private router:Router) { }

 	ngOnInit(): void {

 		this.preload = true;

 		/*=============================================
		Capturamos el parámetro URL
		=============================================*/

		this.params = this.activateRoute.snapshot.params["param"].split("&")[0];
		this.sort = this.activateRoute.snapshot.params["param"].split("&")[1];
		this.page = this.activateRoute.snapshot.params["param"].split("&")[2];

		/*=============================================
		Evaluamos que el segundo parámetro sea de paginación
		=============================================*/
		if(Number.isInteger(Number(this.sort))){

			this.page = this.sort;
			this.sort = undefined;

		}

		/*=============================================
		Evaluamos que el parámetro de orden no esté definido
		=============================================*/

		if(this.sort == undefined){

			this.currentRoute = `search/${this.params}`;

		}else{

			this.currentRoute = `search/${this.params}&${this.sort}`;

		}

		/*=============================================
		Filtramos data de productos con todas las propiedades
		=============================================*/
		this.properties.forEach(property=>{

			this.productsService.getSearchData(property, this.params)
			.subscribe(resp=>{
				for(let i in resp){
					this.listProducts.push(resp[i])
				}

				this.productsFnc(this.listProducts);

			})

		})

  	}

  	/*=============================================
	Declaramos función para mostrar el catálogo de productos
	=============================================*/

  	productsFnc(response:any){
  		if(response.length > 0){
	  		this.products = [];
	  		/*=============================================
			Hacemos un recorrido por la respuesta que nos traiga el filtrado
			=============================================*/
	  		let total = 0;
	  		for(let i in response){
	  			total++;
				this.getProducts.push(response[i]);
			}

			/*=============================================
			Definimos el total de productos y la paginación de productos
			=============================================*/

			this.productFound = total;
			this.totalPage =  Math.ceil(Number(this.productFound)/6);

			/*=============================================
			Ordenamos el arreglo de objetos lo mas actual a lo más antiguo
			=============================================*/
			if(this.sort == undefined || this.sort == "fisrt"){

				this.getProducts.sort(function (a, b) {
				    return (b.date_created - a.date_created)
				})

				this.sortItems = [

					"Sort by first",
					"Sort by latest",
					"Sort by popularity",
					"Sort by price: low to high",
					"Sort by price: high to low"
				]

				this.sortValues = [

					"first",
					"latest",
					"popularity",
					"low",
					"high"
				]
			}

			/*=============================================
			Ordenamos el arreglo de objetos lo mas antiguo a lo más actual
			=============================================*/

			if(this.sort == "latest"){

				this.getProducts.sort(function (a, b) {
				    return (a.date_created - b.date_created)
				})

				this.sortItems = [

					"Sort by latest",
					"Sort by first",
					"Sort by popularity",
					"Sort by price: low to high",
					"Sort by price: high to low"
				]
				this.sortValues = [
					"latest",
					"first",
					"popularity",
					"low",
					"high"
				]

			}

			/*=============================================
			Ordenamos el arreglo de objetos lo mas visto
			=============================================*/

			if(this.sort == "popularity"){

				this.getProducts.sort(function (a, b) {
				    return (b.views - a.views)
				})

				this.sortItems = [

					"Sort by popularity",
					"Sort by first",
					"Sort by latest",
					"Sort by price: low to high",
					"Sort by price: high to low"
				]

				this.sortValues = [

					"popularity",
					"first",
					"latest",
					"low",
					"high"
				]

			}

			/*=============================================
			Ordenamos el arreglo de objetos de menor a mayor precio
			=============================================*/

			if(this.sort == "low"){

				this.getProducts.sort(function (a, b) {
				    return (a.price - b.price)
				})

				this.sortItems = [

					"Sort by price: low to high",
					"Sort by first",
					"Sort by latest",
					"Sort by popularity",
					"Sort by price: high to low"
				]

				this.sortValues = [

					"low",
					"first",
					"latest",
					"popularity",
					"high"
				]


			}

			/*=============================================
			Ordenamos el arreglo de objetos de mayor a menor precio
			=============================================*/

			if(this.sort == "high"){

				this.getProducts.sort(function (a, b) {
				    return (b.price - a.price)
				})

				this.sortItems = [

					"Sort by price: high to low",
					"Sort by first",
					"Sort by latest",
					"Sort by popularity",
					"Sort by price: low to high"

				]

				this.sortValues = [

					"high",
					"first",
					"latest",
					"popularity",
					"low"

				]


			}

			/*=============================================
			Filtramos solo hasta 10 productos
			=============================================*/

			this.getProducts.forEach((product, index)=>{

				/*=============================================
				Evaluamos si viene número de página definida
				=============================================*/

				if(this.page == undefined){

					this.page = 1;
				}

				/*=============================================
				Configuramos la paginación desde - hasta
				=============================================*/

				let first = Number(index) + (this.page*6)-6;
				let last = 6*this.page;

				/*=============================================
				Filtramos los productos a mostrar
				=============================================*/

				if(first < last){

					if(this.getProducts[first] != undefined){

						this.products.push(this.getProducts[first]);

						this.rating.push(DinamicRating.fnc(this.getProducts[first]));

						this.reviews.push(DinamicReviews.fnc(this.rating[index]));

						this.price.push(DinamicPrice.fnc(this.getProducts[first]));

						this.preload = false;

					}
				}

			})

		}else{

			this.preload = false;

		}

  	}

  	/*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/

  	callback(params:any){

  		if(this.render){

  			this.render = false;

  			Rating.fnc();
  			Pagination.fnc();
  			Select2Cofig.fnc();
  			Tabs.fnc();

  			/*=============================================
			Captura del Select Sort Items
			=============================================*/

			$(".sortItems").change(function(){

				window.open(`search/${params}&${$(this).val()}`, '_top')

			})
  		}
  	}
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
