import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from "ngx-cookie-service";
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { UserService } from "../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class VigilanteGuard implements CanActivate {
  constructor(private cookieService:CookieService, private UserService:UserService, private router:Router )
  {
  }

  redirect(flag:boolean):any
  {
    if(!flag)
    {
      Swal.fire({
            icon: 'warning',
            title: '',
            text: 'Para acceder a la pagina debe iniciar sesión',
            footer: '<a href="http://localhost:4200/newaccount"></a>'
          }) 
          
      this.router.navigate(['login'])
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //const cookie = this.cookieService.check('token_access')
    if (this.UserService.getCurrentStorage()) return true;
    
    Swal.fire({
          icon: 'warning',
          title: '',
          text: 'Para acceder a la pagina debe iniciar sesión',
          footer: '<a href="http://localhost:4200/newaccount"></a>'
        }) 
    this.router.navigate(['/login']);
    return false;
    /*this.redirect(cookie);
    return cookie;*/
  }
  
}
