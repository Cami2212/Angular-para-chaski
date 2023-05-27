import { environment } from '../environments/environment';

let domain
let domain2
export let Server
export let Path
export let Email
if (environment.production) {
    /*=============================================
    Entorno Produccción
    =============================================*/
    domain = "https://chaskigo.com/"
    domain2 = "https://chaskigo.com/"
} else {
    /*=============================================
    Entorno Desarrollo
     ============================================*/
    domain = 'http://localhost:4200/'
    domain2 = 'http://localhost:4200/src/'
}
Path = {
        url: domain + 'assets/'
    }
    /*=============================================
    Exportamos el endPoint del servidor para administrar archivos
    =============================================*/
Server = {
        url: domain2 + 'assets/img/index.php?key=AIzaSyAkxXZbJARMdBFNjKm8meCsJ75Y8HPskHs',
        delete: domain2 + 'assets/img/delete.php?key=AIzaSyAkxXZbJARMdBFNjKm8meCsJ75Y8HPskHs'
    }
    /*=============================================
    Exportamos el endPoint del servidor para enviar correos electrónicos
    =============================================*/
Email = {
        url: domain2 + 'assets/email/index.php?key=AIzaSyAkxXZbJARMdBFNjKm8meCsJ75Y8HPskHs'
    }
    /*=============================================
    Exportamos el endPoint de la APIREST de Firebase
    =============================================*/
export let Api = {
        url: 'https://chaskigo-d719c-default-rtdb.firebaseio.com/'
    }
    /*=============================================
    Exportamos el endPoint de la APIREST de Firebase
    =============================================*/
export let ApiCountry = {
        url: 'https://api.countrystatecity.in/v1/countries/'
    }
    /*=============================================
    Exportamos el endPoint para el registro de usuarios en Firebase Authentication
    =============================================*/
export let Register = {
        url: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAkxXZbJARMdBFNjKm8meCsJ75Y8HPskHs'
    }
    /*=============================================
    Exportamos el endPoint para el ingreso de usuarios en Firebase Authentication
    =============================================*/

export let Login = {
        url: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAkxXZbJARMdBFNjKm8meCsJ75Y8HPskHs'
    }
    /*=============================================
    Exportamos el endPoint para enviar verificación de correo electrónico
    =============================================*/

export let SendEmailVerification = {
        url: 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAkxXZbJARMdBFNjKm8meCsJ75Y8HPskHs'
    }
    /*=============================================
    Exportamos el endPoint para confirmar email de verificación=============================================*/

export let ConfirmEmailVerification = {
        url: 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAkxXZbJARMdBFNjKm8meCsJ75Y8HPskHs'
    }
    /*=============================================Exportamos el endPoint para tomar la data del usuario en Firebase auth=============================================*/
export let GetUserData = {
        url: 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAkxXZbJARMdBFNjKm8meCsJ75Y8HPskHs'
    }
    /*=============================================
    Exportamos el endPoint para Resetear la contraseña
    =============================================*/

export let SendPasswordResetEmail = {
        url: 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAkxXZbJARMdBFNjKm8meCsJ75Y8HPskHs'
    }
    /*=============================================
    Exportamos el endPoint para confirmar el cambio de la contraseña
    =============================================*/

export let VerifyPasswordResetCode = {
        url: 'https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=AIzaSyAkxXZbJARMdBFNjKm8meCsJ75Y8HPskHs'
    }
    /*=============================================
    Exportamos el endPoint para enviar la contraseña
    =============================================*/

export let ConfirmPasswordReset = {
        url: 'https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=AIzaSyAkxXZbJARMdBFNjKm8meCsJ75Y8HPskHs'
    }
    /*=============================================
    Exportamos el endPoint para cambiar la contraseña
    =============================================*/

export let ChangePassword = {
    url: 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAkxXZbJARMdBFNjKm8meCsJ75Y8HPskHs'
}