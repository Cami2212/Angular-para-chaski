import {
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { Path } from '../../config';
import {
  DinamicPrice,
  Search,
  Sweetalert,
} from '../../functions';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { SubCategoriesService } from '../../services/sub-categories.service';
import { UsersService } from '../../services/users.service';

declare var jQuey:any;
declare var $ :any;

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.css']
})
export class HeaderMobileComponent implements OnInit {

  path:string= Path.url;
  categories:any[] = [];
  render:boolean = true;
  categoriesList:any[] = [];
  authValidate:boolean = false;
  picture:string;
  wishlist:number = 0;
  shoppingCart:any[] = [];
	totalShoppingCart:number = 0;
	renderShopping:boolean = true;
	subTotal:string = `<h3>Sub Total:<strong class="subTotalHeader"><div class="spinner-border"></div></strong></h3>`;
  constructor(private categoriesService: CategoriesService, private subcategoryServices :SubCategoriesService, private usersService: UsersService, private productsService:ProductsService, private router:Router) {}

  ngOnInit(): void {
	/*=============================================
		Validar si existe usuario autenticado
		=============================================*/
		this.usersService.authActivate().then(resp =>{
			if(resp){
				this.authValidate = true;
        this.usersService.getFilterData("idToken", localStorage.getItem("idToken")).subscribe(resp=>{
          for(const i in resp){
/*=============================================
						Mostramos cantidad de productos en su lista de deseos
						=============================================*/
						if(resp[i].wishlist != undefined){
							this.wishlist = Number(JSON.parse(resp[i].wishlist).length)
						}
						/*=============================================
						Mostramos foto del usuario
						=============================================*/
						if(resp[i].picture != undefined){
							if(resp[i].method != "direct"){
								this.picture = `<img loading="lazy" src="${resp[i].picture}" class="img-fluid rounded-circle ml-auto">`;
							}else{
								this.picture = `<img loading="lazy" src="assets/img/users/${resp[i].username.toLowerCase()}/${resp[i].picture}" class="img-fluid rounded-circle ml-auto ">`;
							}
						}else{
							this.picture = `<i class="icon-user"></i>`;
						}
          }
        })
      }
    })
      this.categoriesService.getFilterData("state","show").subscribe(resp =>{
      for (let i in resp){
		this.categories.push(resp[i])
        this.categoriesList.push(resp[i].name)
    }
    })
    $(document).on('click', '.sub-toggle', function(){

			$(this).parent().children('ul').toggle();

		})
     /*=============================================
		Tomamos la data del Carrito de Compras del LocalStorage
		=============================================*/
		if(localStorage.getItem("list")){
			let list = JSON.parse(localStorage.getItem("list")||'{}');
			this.totalShoppingCart = list.length;
			/*=============================================
			Recorremos el arreglo del listado
			=============================================*/
			for(const i in list){
				/*=============================================
				Filtramos los productos del carrito de compras
				=============================================*/
				this.productsService.getFilterData("url", list[i].product)
				.subscribe(resp=>{
					for(const f in resp){
						let details = `<div class="list-details small text-secondary">`
						if(list[i].details.length > 0){
							let specification = JSON.parse(list[i].details)
							for(const i in specification){
								let property = Object.keys(specification[i]);
								for(const f in property){
									details += `<div>${property[f]}: ${specification[i][property[f]]}</div>`
								}
							}
						}
						else{
							/*=============================================
							Mostrar los detalles por defecto del producto
							=============================================*/
							if(resp[f].specification != ""){
								let specification = JSON.parse(resp[f].specification);
								for(const i in specification){
									let property = Object.keys(specification[i]).toString();
									details += `<div>${property}: ${specification[i][property][0]}</div>`
								}
							}
						}
						details += `</div>`
						this.shoppingCart.push({
							url:resp[f].url,
							name:resp[f].name,
							category:resp[f].category,
							image:resp[f].image,
							delivery_time:resp[f].delivery_time,
							quantity:list[i].unit,
							price: DinamicPrice.fnc(resp[f])[0],
							shipping:(Number(resp[f].shipping)*Number(list[i].unit)).toFixed(2),
							details:details,
							listDetails:list[i].details
						})
					}
				})
			}
		}

  }
    /*=============================================
	Declaramos función del buscador
	=============================================*/

	goSearch(search:string){
		if(search.length == 0 || Search.fnc(search) == undefined){
			return;
		}
		window.open(`search/${Search.fnc(search)}`, '_top')
	}
  callback(){
		if(this.render){
			this.render = false;
			let arraySubCategories:any= [];
			/*=============================================
			Separar las categorías
			=============================================*/
			this.categoriesList.forEach(category=>{
				/*=============================================
				Tomamos la colección de las sub-categorías filtrando con los nombres de categoría
				=============================================*/
				this.subcategoryServices.getFilterData("category", category).subscribe(resp=>{
					/*=============================================
					Hacemos un recorrido por la colección general de subcategorias y clasificamos las subcategorias y url
					de acuerdo a la categoría que correspondan
					=============================================*/
					for(let i in resp){
					    arraySubCategories.push({
							"category": resp[i].category,
							"subcategory": resp[i].name,
							"url":resp[i].url
						})
					}
					/*=============================================
					Recorremos el array de objetos nuevo para buscar coincidencias con los nombres de categorías
					=============================================*/
					for(let i in arraySubCategories){
					if(category == arraySubCategories[i].category){
					$(`[category='${category}']`).append(
						`<li class="current-menu-item "><a href="products/${arraySubCategories[i].url}">${arraySubCategories[i].subcategory}</a></li>`
          )}
					}
			  })
		  })
		}

	}
 /*=============================================
  Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/
	callbackShopping(){
		if(this.renderShopping){
			this.renderShopping = false;
			/*=============================================
			Sumar valores para el precio total
			=============================================*/
			let totalProduct = $(".ps-product--cart-mobile");
			setTimeout(function(){
				let price = $(".pShoppingHeaderM .end-price")
				let quantity = $(".qShoppingHeaderM");
				let shipping = $(".sShoppingHeaderM");
				let totalPrice = 0;
				for(let i = 0; i < price.length; i++){
					/*=============================================
					Sumar precio con envío
					=============================================*/
					let shipping_price = Number($(price[i]).html()) + Number($(shipping[i]).html());
					totalPrice +=  Number($(quantity[i]).html() * shipping_price)
				}
				$(".subTotalHeader").html(`$${totalPrice.toFixed(2)}`)
			},totalProduct.length * 500)
		}
	}
	/*=============================================
	Función para remover productos de la lista de carrito de compras
	=============================================*/
	removeProduct(product:any, details:any){

		if(localStorage.getItem("list")){
			let shoppingCart = JSON.parse(localStorage.getItem("list")||'{}');
			shoppingCart.forEach((list:any, index:any)=>{
				if(list.product == product){
					shoppingCart.splice(index, 1);
				}
			})
			 /*=============================================
    		Actualizamos en LocalStorage la lista del carrito de compras
    		=============================================*/
    		localStorage.setItem("list", JSON.stringify(shoppingCart));
    		Sweetalert.fnc("success", "Producto Eliminado", this.router.url)
		}
	}
}
