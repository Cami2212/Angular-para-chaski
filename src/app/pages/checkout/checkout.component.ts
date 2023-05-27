import {
  Component,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { Path } from '../../config';
import {
  DinamicPrice,
  PayPhone,
  Sweetalert,
} from '../../functions';
import { UsersModel } from '../../models/users.model';
import { OrdersService } from '../../services/orders.service';
import { ProductsService } from '../../services/products.service';
import { SalesService } from '../../services/sales.service';
import { StoresService } from '../../services/stores.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
	path:string = Path.url
	render:boolean = true;
	user: UsersModel
	id:any = null;
	saveAddress:boolean = false;
  idProduct:string|any =null;
	shoppingCart:any = [];
	dialCode:any = null;
	flag:any = null;
	totalP:string = ` <h2 class="text-right">Total <span class="totalCheckout"><div class="spinner-border"></div></span></h2>`
	subTotalP:string = ` <h3 class="text-right">Subtotal <span class="subTotalCheckout"><div class="spinner-border"></div></span></h3>`
	taxP:string = ` <h3 class="text-right">IVA 12% <span class="taxCheckout"><div class="spinner-border"></div></span></h3>`
	totalPrice:any[] = [];
	subTotalPrice:any[] = [];
	paymentMethod:string = "";
	totalShoppingCart:number = 0
	addInfo:string = "";
	/*=============================================
    Variable para capturar el listado de paises
    =============================================*/
    country:any = null;
    stCountry=""
	  countries:any=null;
    /*=============================================
    Variable para capturar el listado de estados de un pais
    =============================================*/
    states:any = null;
    stState=""
    cities:any=null
    stCity=""

	constructor(private router:Router,
		private usersService:UsersService,
		private productsService: ProductsService,
		private ordersService:OrdersService,
		private salesService: SalesService,
		private storesService: StoresService,
		private activatedRoute:ActivatedRoute ) {
      this.user = new UsersModel()
    }
  ngOnInit() {
    /*=============================================
		Validar si existe usuario autenticado
		=============================================*/
		this.usersService.authActivate().then(resp=>{
			if(resp){
				this.usersService.getFilterData("idToken", localStorage.getItem("idToken"))
				.subscribe(resp=>{
					this.id = Object.keys(resp).toString();
					for(const i in resp){
						this.user.displayName = resp[i].displayName;
						this.user.username = resp[i].username;
						this.user.email = resp[i].email;
						this.user.country = resp[i].country;
            this.stCountry= resp[i].country
						this.user.state = resp[i].state;
            this.stState= resp[i].state
						this.user.city = resp[i].city;
            this.stCity= resp[i].city
						if(resp[i].phone != undefined){
							this.user.phone = resp[i].phone.split("-")[1]
							this.dialCode = resp[i].phone.split("-")[0]
						}
						this.user.address = resp[i].address;
						/*=============================================
						Traer listado de países
						=============================================*/
						this.usersService.getCountries()
						.subscribe(resp=>{
							this.countries = resp;
						})
					}
				})
			}
		})

	/*=============================================
		Traer la lista del carrito de compras
		=============================================*/

		if(localStorage.getItem("list")){

			let list = JSON.parse(localStorage.getItem("list"));

			this.totalShoppingCart = list.length;

			if(list.length == 0){

				this.router.navigateByUrl("/shopping-cart");

				return;

			}

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

							let specification = JSON.parse(list[i].details);

							for(const i in specification){

								let property = Object.keys(specification[i]);

								for(const f in property){

									details += `<div>${property[f]}: ${specification[i][property[f]]}</div>`
								}

							}

						}else{

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
							listDetails:list[i].details,
							store:resp[f].store

						})

					}

				})

			}


		}else{

			this.router.navigateByUrl("/shopping-cart");

			return;

		}
 }
/*=============================================
	Guardar datos de envíos del usuario
	=============================================*/
	saveAddressFnc(inputCountry, inputState, inputCity, inputPhone, inputAddress, inputSaveAddress){
		if(this.saveAddress){
			if(inputCountry.value != "" &&
			   inputCity.value != "" &&
			   inputState.value != "" &&
			   inputPhone.value != "" &&
			   inputAddress.value != ""){
			   	let body = {
			   		country: this.user.country,
			   		country_code: this.user.country_code,
					state: this.user.state,
			   		city: this.user.city,
			   		phone: `${this.dialCode}-${this.user.phone}`,
			   		address: this.user.address
			   	}
			   	this.usersService.patchData(this.id, body)
			   	.subscribe(resp=>{
			   		Sweetalert.fnc("success", "Your data was updated", null)
			   	})
			}
      else{
				inputSaveAddress.checked = false;
				Sweetalert.fnc("error", "Please fill in the required fields", null)
			}
		}
	}
 onSubmit(f: NgForm){
  /*=============================================
  		Validamos formulario para evitar campos vacíos
  		=============================================*/
      if(f.invalid ){
        Sweetalert.fnc("error", "Requerimiento Inválido", null);
        return;
      }
      /*=============================================
  		Sweetalert para esperar el proceso de ejecución
  		=============================================*/
	    Sweetalert.fnc("loading", "Loading...", null)
   		/*=============================================
  		Pasarelas de pago
  		=============================================*/
		if(f.value.paymentMethod == "payphone"){
      /*=============================================
			Creamos el código de referencia
			=============================================*/
		const randomId=(longitud:number)=>{
        const banco = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        let aleatoria = "";
        for (let i = 0; i < longitud; i++) {
            // Lee más sobre la elección del índice aleatorio en:
            // https://parzibyte.me/blog/2021/11/30/elemento-aleatorio-arreglo-javascript/
            aleatoria += banco.charAt(Math.floor(Math.random() * banco.length));
        }
        return aleatoria;
      }
      Sweetalert.fnc("html", `<div id="pp-button"></div>`, null)
      PayPhone.fnc(this.totalPrice[0]*100,randomId(10), this.user.phone).then(resp=>{
		if(resp.transactionStatus == "Approved"){
			localStorage.setItem("id_payment", resp.transactionId)
			let totalRender = 0;
			/*=============================================
			Tomamos la información de la venta
			=============================================*/
			this.shoppingCart.forEach((product, index)=>{
			totalRender ++
				/*=============================================
						Enviar actualización de cantidad de producto vendido a la base de datos
						=============================================*/
						this.productsService.getFilterData("url", product.url)
						.subscribe(resp=>{
							for(const i in resp){
								this.idProduct = resp[i].id
								let value = {
									sales: Number(resp[i].sales)+Number(product.quantity),
									stock: Number(resp[i].stock)-Number(product.quantity)
								}
								this.productsService.patchDataAuth(this.idProduct, value, localStorage.getItem("idToken") as string)
								.subscribe(resp=>{})
							}
						})
						/*=============================================
						Crear el proceso de entrega de la venta
						=============================================*/
						let moment = Math.floor(Number(product.delivery_time)/2);
						let sentDate = new Date();
						sentDate.setDate(sentDate.getDate()+moment);
						let deliveredDate = new Date();
						deliveredDate.setDate(deliveredDate.getDate()+Number(product.delivery_time))
						let proccess = [
							{
								stage:"reviewed",
								status:"ok",
								comment:"Pedido Recibido, en proceso de envío",
								date:new Date()
							},
							{
								stage:"sent",
								status:"pending",
								comment:"",
								date:sentDate
							},
							{
								stage:"delivered",
								status:"pending",
								comment:"",
								date:deliveredDate
							}
						]
						/*=============================================
						Crear orden de venta en la base de datos
						=============================================*/
						let body = {
							store:product.store,
							user: this.user.username,
							product: product.name,
							url:product.url,
							image:product.image,
							category: product.category,
							quantity:product.quantity,
							price: this.subTotalPrice[index],
							email:f.value.email,
							country:f.value.country,
							city:f.value.city,
							phone:`${this.dialCode}-${f.value.phone}`,
							address:f.value.address,
							info:f.value.addInfo,
              date: new Date(),
							process:JSON.stringify(proccess),
							status:"pending"
						}
						this.ordersService.registerDatabase(body, localStorage.getItem("idToken")as string)
						.subscribe(resp=>{

							if(resp["name"] != ""){
							/*=============================================
								Separamos la comisión del Marketplace y el pago a la tienda del precio total de cada producto
							=============================================*/
								let commission = 0;
								let unitPrice = 0;
								commission = this.subTotalPrice[index]*0.25;
								unitPrice = this.subTotalPrice[index]*0.75;
/*=============================================
								Enviar información de la venta a la base de datos
								=============================================*/
								let body = {
									id_order: resp["name"],
									client: this.user.username,
									product: product.name,
									url:product.url,
									quantity:product.quantity,
									unit_price: unitPrice.toFixed(2),
									commission: commission.toFixed(2),
									total: this.subTotalPrice[index],
									payment_method: f.value.paymentMethod,
									id_payment: localStorage.getItem("id_payment"),
									date: new Date(),
									status: "pending"
								}
								this.salesService.registerDatabase(body, localStorage.getItem("idToken")as string)
								.subscribe(resp=>{})
							}
						})
			})
			/*=============================================
					Preguntamos cuando haya finalizado el proceso de guardar todo en la base de datos
					=============================================*/
					if(totalRender == this.shoppingCart.length){
						localStorage.removeItem("list");
						Sweetalert.fnc("success", 'Pago ' + resp.transactionId + ' recibido, estado ' + resp.transactionStatus +'  Su pedido a sido enviado satisfactoriamente!', "account/my-shopping");
					}
		}
		else{
			Sweetalert.fnc("error", "No se pudo realizar el pago, por favor intente nuevamente", null);
		}
	  })
    }
	else{
		Sweetalert.fnc("error", "Invalid request", null)
		  return;
	}
 }
onCountrySelected(select:any){
  console.log(select.target.value)
	/*=============================================
	Traer listado de provincias por país
	=============================================*/
	this.countries.forEach(element => {
	  if(select.value == element.name){
	this.usersService.getStates(element.iso2)
	.subscribe(resp=>{
		this.states = resp;
		this.country = element.iso2
	})
	this.usersService.getInfoCountry(element.iso2)
	.subscribe(resp=>{
		let index = Object.keys(resp)
		let value = Object.values(resp)
		for(let i=0; i<index.length;i++){
		if(index[i]=='phonecode'){
		  this.dialCode= value[i]
		}
		else if(index[i]=='emoji'){
			this.flag= value[i]
		  }
		}
	})
  }
	});
}
onStateSelected(select:any){
/*=============================================
	Traer listado de ciudades por país
	=============================================*/
	this.states.forEach(element => {
	  if(select.value == element.name)
		this.usersService.getCity(this.country, element.iso2).subscribe(resp=>{
		this.cities = resp;
	})
   });

}
/*=============================================
	Función Callback()
	=============================================*/
	callback(){
		if(this.render){
			this.render = false;
			let totalShoppingCart = this.totalShoppingCart;
			let localTotalPrice = this.totalPrice;
			let localSubTotalPrice = this.subTotalPrice;
			/*=============================================
			Mostrar lista del carrito de compras con los precios definitivos
			=============================================*/
			setTimeout(function(){
	    		let price = $(".pCheckout .end-price");
	    		let quantity = $(".qCheckout");
	    		let shipping = $(".sCheckout");
	    		let subTotalPrice = $(".subTotalPriceCheckout");
	    		let total = 0;
				let withouttax=0
				let tax=0
	    		for(let i = 0; i < price.length; i++){
	    			/*=============================================
					Sumar precio con envío
					=============================================*/
					let shipping_price = Number($(price[i]).html()) + Number($(shipping[i]).html())
					/*=============================================
					Multiplicar cantidad por precio con envío
					=============================================*/
					let subTotal = Number($(quantity[i]).html())*shipping_price
					/*=============================================
					Mostramos subtotales de cada producto
					=============================================*/
					$(subTotalPrice[i]).html(`$${subTotal.toFixed(2)}`)
					localSubTotalPrice.push(subTotal.toFixed(2))
					/*=============================================
					Definimos el total de los precios
					=============================================*/
					total += subTotal;
					withouttax = total/1.12
					tax=total-withouttax
	    		}
				$(".subTotalCheckout").html(`$${withouttax.toFixed(2)}`)
				$(".taxCheckout").html(`$${tax.toFixed(2)}`)
	    		$(".totalCheckout").html(`$${total.toFixed(2)}`)
	    		localTotalPrice.push(total.toFixed(2));
	    	},totalShoppingCart*500)
		}
	}
}
