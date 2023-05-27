import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

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
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
	path:string= Path.url
	categories:any[]=[]
	categoriesSubscription!: Subscription;
	titleLists:any[]=[];
	render:boolean=true;
	authValidate:boolean = false;
	picture:string;
	wishlist:number = 0;
	shoppingCart:any[] = [];
	totalShoppingCart:number = 0
	renderShopping:boolean = true
	displayName:any;
	subTotal:string = `<h3>Sub Total:<strong class="subTotalHeader"> <div class="spinner-border"></div> </strong></h3>`
  constructor(private categoriesService: CategoriesService, private subcategoryServices :SubCategoriesService, private usersService: UsersService, private productsService:ProductsService, private router:Router) { }
  ngOnInit(): void {
    /*=============================================
		Validar si existe usuario autenticado
		=============================================*/
		this.usersService.authActivate().then(resp =>{
			if(resp){
				this.authValidate = true;
        this.usersService.getFilterData("idToken", localStorage.getItem("idToken")).subscribe(resp=>{
          for(const i in resp){
			let user = resp[i].displayName
			let [name , surname]:string= user.split(' ');
			this.displayName = name
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
								this.picture = `<img loading="lazy" src="assets/img/users/${resp[i].username.toLowerCase()}/${resp[i].picture}" class="img-fluid rounded-circle ml-auto">`;
							}
						}else{
							this.picture = `<i class="icon-user"></i>`;
						}
          }
        })
      }
    })
    	/*=============================================
		Tomamos la data de las categorías
		=============================================*/
    this.categoriesSubscription = this.categoriesService.getFilterData("state","show").subscribe(resp =>{
      /*=============================================
			Recorremos la colección de categorías para tomar la lista de títulos
			=============================================*/
      for (let i in resp){
		this.categories.push(resp[i])
        /*=============================================
				Separamos la lista de títulos en índices de un array
				=============================================*/
          this.titleLists.push(JSON.parse(resp[i].title_list))
      }
    })
    /*=============================================
		Tomamos la data del Carrito de Compras del LocalStorage
		=============================================*/
		if(localStorage.getItem("list")){
			let list = JSON.parse(localStorage.getItem("list")as string);
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
								let specification = JSON.parse(resp[f].specification)
								for(const i in specification){
									let property = Object.keys(specification[i]).toString();
									details += `<div>${property}: ${specification[i][property][0]}</div>`
								}
							}
						}
						details += `</div>`;

						this.shoppingCart.push({
							url:resp[f].url,
							name:resp[f].name,
							category:resp[f].category,
							image:resp[f].image,
							delivery_time:resp[f].delivery_time,
							quantity:list[i].unit,
							price: DinamicPrice.fnc(resp[f])[0],
							shipping:Number(resp[f].shipping)*Number(list[i].unit),
							details:details,
						})
          			}
				})
			}
		}
  }
  ngOnDestroy(): void {
    this.categoriesSubscription && this.categoriesSubscription.unsubscribe();
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
        this.render=false;
        let ArraySubcategories:any = [];
        this.titleLists.forEach(datatitleLists=>{
          for (let i=0; i<datatitleLists.length; i++){
            this.subcategoryServices.getFilterData("title_list", datatitleLists[i]).subscribe(resp=>{
              ArraySubcategories.push(resp)
              let ArrayTitleName:any = [];
              for (let j in ArraySubcategories){
                for(let g in ArraySubcategories[j]){
                  ArrayTitleName.push({
                    "titleList": ArraySubcategories[j][g].title_list,
                    "subcategory": ArraySubcategories[j][g].name,
                    "url": ArraySubcategories[j][g].url
                  })
                }
              }
              for(let j in ArrayTitleName){
                if(datatitleLists[i] == ArrayTitleName[j].titleList){
                  $(`[titleList='${datatitleLists[i]}']`).append(
                    `
                    <li>
                        <a href="products/${ArrayTitleName[j].url}">${ArrayTitleName[j].subcategory}</a>
                    </li>
                    `
                  )
                }
              }
            })
          }
        })
      }
  }
  /*=============================================
  Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/
callbackShopping(){
	let totalPrice:number = 0
	if(this.renderShopping){
		this.renderShopping = false;
		/*=============================================
		Sumar valores para el precio total
		=============================================*/
		let totalProduct = $(".ps-product--cart-mobile")
		setTimeout(function(){
			let price = $(".pShoppingHeader .end-price")
			let quantity = $(".qShoppingHeader")
			let shipping = $(".sShoppingHeader")
			for(let i=0; i < price.length; i++){
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
	removeProduct(product:object, details:any){

		if(localStorage.getItem("list")){
			let shoppingCart = JSON.parse(localStorage.getItem("list")||'{}');
			shoppingCart.forEach((list, index)=>{
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
