import 'firebase/compat/firestore';

import {
  Component,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';

import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import firebase from 'firebase/compat/app';

import { Path } from '../../config';
import {
  Capitalize,
  Sweetalert,
} from '../../functions';
import { UsersModel } from '../../models/users.model';
import { UsersService } from '../../services/users.service';

declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
    user: UsersModel;
    path:string = Path.url
  constructor(private usersService: UsersService) {
    this.user = new UsersModel()
  }
  ngOnInit() {

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
  Capitalizar la primera letra de nombre y apellido
  =============================================*/
  }
  capitalize(input:any){
    input.value = Capitalize.fnc(input.value)
  }
  /*=============================================
  Validación de expresión regular del formulario
  =============================================*/
  validate(input:any){
    let pattern;
    if($(input).attr("name") == "username"){
      pattern = /^[A-Za-z]{2,8}$/;
      input.value = input.value.toLowerCase();
      this.usersService.getFilterData("username", input.value)
      .subscribe(resp=>{
        if(Object.keys(resp).length > 0){
          $(input).parent().addClass('was-validated')
          input.value = "";
          Sweetalert.fnc("error", "Username ya existe", null)
          return;
        }
      })
    }
    if($(input).attr("name") == "password"){
      pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/;
    }
    if(!pattern.test(input.value)){
      $(input).parent().addClass('was-validated')
      input.value = "";
    }
  }
  onSubmit(f: NgForm){
    if(f.invalid ){
      return;
    }
    /*=============================================
      	Alerta suave mientras se registra el usuario
      	=============================================*/
      	Sweetalert.fnc("loading", "Loading...", null)
      	/*=============================================
       	Validar que el correo esté verificado
        =============================================*/
    /*=============================================
  	Registro en Firebase Authentication
  	=============================================*/
    this.user.returnSecureToken = true;
		this.usersService.registerAuth(this.user)
		.subscribe(resp=>{
      if(resp["email"] == this.user.email){
        /*=============================================
        Enviar correo de verificación
        =============================================*/
        let body = {
          requestType: "VERIFY_EMAIL",
          idToken: resp["idToken"]
        }
        this.usersService.sendEmailVerificationFnc(body)
        .subscribe(resp=>{
          this.user.displayName = `${this.user.first_name } ${this.user.last_name}`
            this.user.method = "direct"
            this.user.needConfirm = false
            this.user.username=this.user.username.toLowerCase()
            let today =new Date()
            let day = today.getDate()
            let month =(today.getMonth())+1
            let year = today.getFullYear()
            this.user.userCreated= `${day}-${month}-${year}`
            /*=============================================
            Registro en Firebase Database
            =============================================*/
            this.usersService.registerDatabase(this.user)
            .subscribe(resp=>{
              Sweetalert.fnc("success", "Confirma tu cuenta en tu bandeja de entrada de correo (Revisar spam)", "login")
            })
        })
      }
    },err =>{
      if(err.error.error.message="EMAIL_EXIST"){
        Sweetalert.fnc("error", "Ya existe un registro con este correo", null)
      }
      else{Sweetalert.fnc("error", err.error.error.message, null)}
    })
  }

  /*=============================================
  Registro con Facebook
  =============================================*/
  facebookRegister(){
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
      registerFirebaseDatabase(result, localUser, localUsersService)
    }).catch(function(error){
      var errorMessage = error.message
      Sweetalert.fnc("error", errorMessage, "register")
    })
    function registerFirebaseDatabase(result, localUser, localUsersService){
      if(result){
        var user=result.user
        let today =new Date()
        let day = today.getDate()
        let month =(today.getMonth())+1
        let year = today.getFullYear()
          localUser.displayName = user.displayName
          localUser.email = user.email
          localUser.idToken = user.accessToken
          localUser.method = result.providerId
          localUser.needConfirm = true,
          localUser.username = user.email.split('@')[0],
          localUser.picture = user.photoURL,
          localUser.userCreated = `${day}-${month}-${year}`,
          localUser.returnSecureToken = true
        localUsersService.getFilterData("email",localUser.email).subscribe(resp=>{
          if(Object.keys(resp).length>0){
            Sweetalert.fnc("error","Ya te encuentras registrado con Facebook, inicia tu cuenta", "login")
          }
          else{
            localUsersService.registerDatabase(localUser).subscribe(resp=>{
              if(resp["name"]!= ""){
                Sweetalert.fnc("success","Por favor iniciar con tu cuenta de Facebook", "login")
              }
            })
          }
        })
      }
    }
  }

  googleRegister(){
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
    auth.languageCode = 'it';
    /*=============================================
    acceder con una ventana emergente y con certificado SSL (https)
    =============================================*/
    //ng serve --ssl true --ssl-cert "/path/to/file.crt" --ssl-key "/path/to/file.key"
    signInWithPopup(auth, provider).then(function(result:any) {
      registerFirebaseDatabase(result, localUser, localUsersService)
    }).catch(function(error){
      var errorMessage = error.message
      Sweetalert.fnc("error", errorMessage, "register")
    })
    function registerFirebaseDatabase(result, localUser, localUsersService){
      if(result){
        var user=result.user
        let today =new Date()
        let day = today.getDate()
        let month =(today.getMonth())+1
        let year = today.getFullYear()
          localUser.displayName = user.displayName
          localUser.email = user.email
          localUser.idToken = user.accessToken
          localUser.method = result.providerId
          localUser.needConfirm = true,
          localUser.username = user.email.split('@')[0],
          localUser.picture = user.photoURL,
          localUser.userCreated = `${day}-${month}-${year}`,
          localUser.returnSecureToken = true
        localUsersService.getFilterData("email",localUser.email).subscribe(resp=>{
          if(Object.keys(resp).length>0){
            Sweetalert.fnc("error","Ya te encuentras registrado con Google, inicia tu cuenta", "login")
          }
          else{
            localUsersService.registerDatabase(localUser).subscribe(resp=>{
              if(resp["name"]!= ""){
                Sweetalert.fnc("success","Por favor iniciar con tu cuenta de Google", "login")
              }
            })
          }
        })
      }
    }
}
}
