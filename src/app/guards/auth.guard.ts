import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { UsersService } from '../../app/services/users.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor(private usersService: UsersService, private router:Router){}

  canActivate(): Promise<boolean> {
      return new  Promise(resolve=>{
        this.usersService.authActivate().then(resp=>{
          if(!resp){
            this.router.navigateByUrl("/login")
            resolve(false)
          }
          else{
            resolve(true)
          }
        })
      })
  }
}
