import 'firebase/compat/firestore';

import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { functions } from 'src/app/helpers/functions';
import { Ilogin } from 'src/app/interfaces/Ilogin';

import { Path } from '../../config';
import { Sweetalert } from '../../functions';
import { UsersModel } from '../../models/users.model';
import { UsersService } from '../../services/users.service';

declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 public f =this.form.group({
    email:['',[Validators.required, Validators.email]],
    password:['',Validators.required]
 })

  hide = true;
  path:string = Path.url
  user: UsersModel
  rememberMe:boolean=false
  /*=============================================
	Variable que valida el envío del formulario
	=============================================*/
	formSubmitted = false;

  constructor(private usersService: UsersService, private activatedRoute: ActivatedRoute, private form: FormBuilder) {
    this.user = new UsersModel()
  }
  ngOnInit() {
    /*=============================================
		Validar acción de recordar credencial de correo
		=============================================*/
		if(localStorage.getItem("rememberMe") && localStorage.getItem("rememberMe") == "yes"){
			this.user.email = localStorage.getItem("email");
			this.rememberMe = true;
		}
    /*=============================================
		Validar formulario de Bootstrap 4
		=============================================*/
		// Disable form submissions if there are invalid fields
		(function() {
			'use strict';
			window.addEventListener('load', function() {
		// Get the forms we want to add validation styles to
		var forms = document.getElementsByClassName('needs-validation');
		// Loop over them and prevent submission
		var validation = Array.prototype.filter.call(forms, function(form) {
			form.addEventListener('submit', function(event:any) {
				if (form.checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
				}
				form.classList.add('was-validated');
			}, false);
		});
		}, false);
		})();
    /*=============================================
		Verificar cuenta de correo electrónico
		=============================================*/
	if(this.activatedRoute.snapshot.queryParams["oobCode"] != undefined &&
  this.activatedRoute.snapshot.queryParams["mode"] == "verifyEmail"){
   let body = {
     oobCode: this.activatedRoute.snapshot.queryParams["oobCode"]
   }
   this.usersService.confirmEmailVerificationFnc(body)
   .subscribe({
    next: resp=>{
     if(resp["emailVerified"]){
       /*=============================================
           Actualizar Confirmación de correo en Database
           =============================================*/
           this.usersService.getFilterData("email", resp["email"])
           .subscribe(resp=>{
             for(const i in resp){
               let id = Object.keys(resp).toString();
               let value = {
                 needConfirm: true
               }
               this.usersService.patchData(id, value)
               .subscribe(resp=>{
                 if(resp["needConfirm"]){
                   Sweetalert.fnc("success", "¡Email confirm, login now!", "login")
                 }
               })
             }
           })
     }
   },
   error: error =>{
     if(error.error.error.message == "INVALID_OOB_CODE"){
       Sweetalert.fnc("error", "The email has already been confirmed", "login")
     }
    }
   })
  }
    /*=============================================
		Confirmar cambio de contraseña
		=============================================*/
		if(this.activatedRoute.snapshot.queryParams["oobCode"] != undefined &&
    this.activatedRoute.snapshot.queryParams["mode"] == "resetPassword"){
   let body = {
     oobCode: this.activatedRoute.snapshot.queryParams["oobCode"]
   }
   this.usersService.verifyPasswordResetCodeFnc(body)
   .subscribe(resp=>{
     if(resp["requestType"] == "PASSWORD_RESET"){
       $("#newPassword").modal()
     }
   })
 }
}
login(){
  /*=============================================
	Validamos que el formulario haya sido enviado
	=============================================*/
  this.formSubmitted = true
  /*=============================================
	Validamos que el formulario esté correcto
	=============================================*/
		if(this.f.invalid){
      Sweetalert.fnc("error", "Ingrese su correo y contraseña", null)
			return;
		}
  /*=============================================
		Capturamos la información del formulario en la interfaz
		=============================================*/
		const data: Ilogin = {
			email: this.f.controls['email'].value,
			password: this.f.controls['password'].value,
			returnSecureToken: true
		}
        /*=============================================
      	Alerta suave mientras se registra el usuario
      	=============================================*/
      	Sweetalert.fnc("loading", "Loading...", null)
        /*=============================================
       	Validar que el correo esté verificado
        =============================================*/
     	this.usersService.getFilterData("email", data.email)
     	.subscribe( resp1 =>{
        if(Object.keys(resp1).length!=0){
          for(const i in resp1){
          if(resp1[i].needConfirm){
             /*=============================================
              Login en Firebase Authentication
			    	=============================================*/
			  		this.user.returnSecureToken = true;
			  		this.usersService.loginAuth(data)
			  		.subscribe( resp2 => {
              /*=============================================
			    		Almacenar id Token en Firebase Database
			    		=============================================*/
			    		let id = Object.keys(resp1).toString();
              let value = {
                idToken: resp2["idToken"]
              }
              this.usersService.patchData(id, value)
		      			.subscribe(resp3=>{
		      				if(resp3["idToken"] != ""){
                    Sweetalert.fnc("close", null, null)
                    Sweetalert.fnc("success", "Validación Exitosa", "login")
                    /*=============================================
								Almacenamos el Token de seguridad en el localstorage
								=============================================*/
								localStorage.setItem("idToken", resp3["idToken"]);
                /*=============================================
								Almacenamos el email en el localstorage
								=============================================*/
								localStorage.setItem("email", resp2["email"]);
								/*=============================================
								Almacenamos la fecha de expiración localstorage
								=============================================*/
								let today = new Date();
								today.setSeconds(resp2["expiresIn"]);
								localStorage.setItem("expiresIn", today.getTime().toString());
                /*=============================================
								Almacenamos recordar email en el localStorage
								=============================================*/
								if(this.rememberMe){
									localStorage.setItem("rememberMe", "yes");
								}else{
									localStorage.setItem("rememberMe", "no");
								}
                /*=============================================
								Redireccionar al usuario a la página de su cuenta
								=============================================*/
								window.open("shopping-cart", "_top");
                }
                })
            },err =>{
              if(err.error.error.message="INVALID_PASSWORD"){
                Sweetalert.fnc("error", "Contraseña Incorrecta", null)
              }
            })
          }
          else{
            Sweetalert.fnc("error", "Necesitas confirmar tu correo", null)
          }
          }
        }
        else{
          Sweetalert.fnc("error", "Email no tiene registro", null)
          return
        }
     })

}
invalidField(field:string){
return functions.invalidField(field, this.f, this.formSubmitted)
}

 validate(){
 const form = document.getElementById("sign-in")
 const inputs = document.querySelectorAll("#sign-in input")
 const email = document.getElementById("email")

 const validators = {
  correo: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
	password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/ // 4 a 12 digitos.
  }
 const validarForm = (e)=>{
  switch(e.target.name){
    case "email":

      if(validators.correo.test(e.target.value)){
      }
      else{
        email?.classList.add('form-control--error')
        email?.classList.remove('form-control:focus')
      }

    break
    case "password":
      if(validators.password.test(e.target.value)){
      }
      else{
      }
    break
  }
 }
 inputs.forEach((input)=>{
  input.addEventListener('keyup', validarForm)
  input.addEventListener('blur', validarForm)
 })
 form?.addEventListener('submit',(e)=>{
  e.preventDefault()

 })
}

    /*=============================================
   	Enviar solicitud para recuperar Contraseña
    =============================================*/
    resetPassword(value:any){
    	Sweetalert.fnc("loading", "Loading...", null);
    	this.usersService.getFilterData("email", value)
		.subscribe(resp=>{
			if(Object.keys(resp).length > 0){
		    	let body = {
		    		requestType: "PASSWORD_RESET",
		    		email: value

		    	}
		    	this.usersService.sendPasswordResetEmailFnc(body)
		    	.subscribe(resp=>{
		    		if(resp["email"] == value){
		    			Sweetalert.fnc("success", "Check your email to change the password", "login")
		    		}
		    	})
		    }else{
				Sweetalert.fnc("error", "The email does not exist in our database", null)
			}
		})
    }
    /*=============================================
   	Enviar nueva Contraseña
    =============================================*/
    newPassword(value:any){
    	if(value != ""){
	    	Sweetalert.fnc("loading", "Actualizando...", null)
	    	let body = {
	    		oobCode: this.activatedRoute.snapshot.queryParams["oobCode"],
	    		newPassword: value
	    	}
	    	this.usersService.confirmPasswordResetFnc(body)
	    	.subscribe(resp=>{
	    		if(resp["requestType"] == "PASSWORD_RESET"){
	    			Sweetalert.fnc("success", "Su contraseña a sido cambiada satisfactoriamente, inicia tu cuenta ahora", "login")
	    		}
	    	})
	    }
    }
    facebookLogin(){
      let localUsersService = this.usersService;
      let localUser = this.user;
      // https://firebase.google.com/docs/web/setup
      // Crea una nueva APP en Settings
      // npm install --save firebase
      // Agregar import * as firebase from "firebase/app";
      // import "firebase/auth"; revisar version 9.0
      /*=============================================
      Inicializa Firebase en tu proyecto web
      =============================================*/
      const firebaseConfig = {
        apiKey: "AIzaSyCHoFlA5FukTEOqVqO-x3gCHIuVuoB4fo8",
        authDomain: "chaskigo-d719c.firebaseapp.com",
        databaseURL: "https://chaskigo-d719c-default-rtdb.firebaseio.com",
        projectId: "chaskigo-d719c",
        storageBucket: "chaskigo-d719c.appspot.com",
        messagingSenderId: "300686559345",
        appId: "1:300686559345:web:2678fc449b7c8f068633d0",
        measurementId: "G-SP9NCPT3TK"
      }
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig)
      //https://firebase.google.com/docs/auth/web/facebook-login
      /*=============================================
      Crea una instancia del objeto proveedor de Facebook
      =============================================*/
      const provider = new FacebookAuthProvider()
      const auth = getAuth();
      auth.languageCode = 'it';
      /*=============================================
      acceder con una ventana emergente y con certificado SSL (https)
      =============================================*/
      //ng serve --ssl true --ssl-cert "/path/to/file.crt" --ssl-key "/path/to/file.key"
      signInWithPopup(auth, provider).then(function(result:any) {
        loginFirebaseDatabase(result, localUser, localUsersService)
      }).catch(function(error){
        var errorMessage = error.message
        Sweetalert.fnc("error", errorMessage, "login")
      })
      function loginFirebaseDatabase(result, localUser, localUsersService){
        var user=result.user
        if(result){
          localUsersService.getFilterData("email", user.email).subscribe(resp=>{
            if(Object.keys(resp).length>0){
              if(resp[Object.keys(resp)[0]].method =='facebook.com'){
                let id = Object.keys(resp).toString()
                let body ={
                  idToken: resp[Object.keys(resp)[0]].idToken
                }
                localUsersService.patchData(id, body).subscribe(resp1=>{
                  localStorage.setItem("idToken", resp[Object.keys(resp)[0]].idToken);
                  /*=============================================
  								Almacenamos el email en el localstorage
  								=============================================*/
  								localStorage.setItem("email", resp[Object.keys(resp)[0]].email);
  								/*=============================================
  								Almacenamos la fecha de expiración localstorage
  								=============================================*/
  								let today = new Date();
  								today.setSeconds(3600);
  								localStorage.setItem("expiresIn", today.getTime().toString());
                  /*=============================================
  								Redireccionar al usuario a la página de su cuenta
  								=============================================*/
  								window.open("account", "_top");
                })
              }
              else{
                Sweetalert.fnc("error","Tu cuenta ha sido registrado con otro método de autenticación", "login")
              }
            }
            else{
              Sweetalert.fnc("error","No se encuentra registros de esta cuenta", "register")
            }
          })
        }
      }
    }
    googleLogin(){
      let localUsersService = this.usersService;
      let localUser = this.user;
      // https://firebase.google.com/docs/web/setup
      // Crea una nueva APP en Settings
      // npm install --save firebase
      // Agregar import * as firebase from "firebase/app";
      // import "firebase/auth"; revisar version 9.0
      /*=============================================
      Inicializa Firebase en tu proyecto web
      =============================================*/
      const firebaseConfig = {
        apiKey: "AIzaSyCHoFlA5FukTEOqVqO-x3gCHIuVuoB4fo8",
        authDomain: "chaskigo-d719c.firebaseapp.com",
        databaseURL: "https://chaskigo-d719c-default-rtdb.firebaseio.com",
        projectId: "chaskigo-d719c",
        storageBucket: "chaskigo-d719c.appspot.com",
        messagingSenderId: "300686559345",
        appId: "1:300686559345:web:2678fc449b7c8f068633d0",
        measurementId: "G-SP9NCPT3TK"
      }
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig)
      //https://firebase.google.com/docs/auth/web/facebook-login
      /*=============================================
      Crea una instancia del objeto proveedor de Facebook
      =============================================*/
      const provider = new GoogleAuthProvider()
      const auth = getAuth();
      /*=============================================
      acceder con una ventana emergente y con certificado SSL (https)
      =============================================*/
      //ng serve --ssl true --ssl-cert "/path/to/file.crt" --ssl-key "/path/to/file.key"
      signInWithPopup(auth, provider).then((result)=> {
        loginFirebaseDatabase(result, localUser, localUsersService)
      }).catch((error)=>{
        var errorMessage = error.message
        Sweetalert.fnc("error", errorMessage, "login")
      })
      function loginFirebaseDatabase(result:any, localUser:any, localUsersService:any){
        var user = result.user
        if(result){
          localUsersService.getFilterData("email", user.email).subscribe(resp=>{
            if(Object.keys(resp).length>0){
              if(resp[Object.keys(resp)[0]].method =="google.com"){
                let id = Object.keys(resp).toString()
                let body ={
                  idToken: result.user.accessToken
                }
                localUsersService.patchData(id, body).subscribe(resp1=>{
                  localStorage.setItem("idToken", resp1.idToken);
                  /*=============================================
  								Almacenamos el email en el localstorage
  								=============================================*/
  								localStorage.setItem("email", resp[Object.keys(resp)[0]].email);
  								/*=============================================
  								Almacenamos la fecha de expiración localstorage
  								=============================================*/
  								let today = new Date();
  								today.setSeconds(3600);
  								localStorage.setItem("expiresIn", today.getTime().toString());
                  /*=============================================
  								Redireccionar al usuario a la página de su cuenta
  								=============================================*/
  								window.open("account", "_top");
                })
              }
              else{
                Sweetalert.fnc("error","Tu cuenta ha sido registrado con otro método de autenticación", "login")
              }
            }
            else{
              Sweetalert.fnc("error","No se encuentra registros de esta cuenta", "register")
            }
          })
        }
      }
    }
    hidePassword(){
    const iconEye = document.querySelector("#hidePassword")
    iconEye?.addEventListener("click", function(){
      const icon = this.querySelector("i")
     if(this.nextElementSibling.type == "password"){
      this.nextElementSibling.type="text"
      icon.classList.remove("fa-eye-slash")
      icon.classList.add("fa-eye")
     }
     else{
      this.nextElementSibling.type="password"
      icon.classList.add("fa-eye-slash")
      icon.classList.remove("fa-eye")
     }

    })
    }

}
