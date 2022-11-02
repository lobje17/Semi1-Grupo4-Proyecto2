import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { userInteface } from 'src/app/models/user-interface';
import { UserService } from 'src/app/services/user.service';
import { CookieService } from "ngx-cookie-service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router:Router, private service:UserService, private cookieService:CookieService) { }

  ngOnInit(): void {
  }

  username:string = "";
  password:string = "";

  Login()
  {
    if(this.fields_filled())
    {
      this.service.LogIn(this.username, this.password).subscribe((res)=>{
        console.log(res)
        let accces = '';
        try {
          accces = res.result.idToken.jwtToken
        }catch (err){}

        //console.log(res['info']);
        //console.log(res);
        if(accces != '')
        {
          this.show_message('success', 'Welcome '+this.username + '');
          /* SE ALMACENA EL COOKIE PARA EL BLOQUEO */
          // this.cookieService.set('token_access',res['info'], 4, '/');
          /* SE ALMACENA LOS DATOS CON EL FORMATO ESTABLECIDO */
          let castnfo:userInteface = res;
          this.service.setCurrentUser(castnfo);

          this.router.navigate(['account']);
        }
        else
        {
          this.show_message('error', res.name);
        }
      })
    }
  }

  show_message(tipo:any, info:string)
  {
    Swal.fire({
            icon: tipo,
            title: 'Iniciar sesión',
            text: info,
            footer: '<a href="http://localhost:4200/newaccount"></a>'
          })
  }

  /* CAMPOS LLENOS */
  fields_filled()
  {
    let cadena = "";
    if(this.username=="" || this.username==" ")
    {
      if(cadena!="") cadena += ", ";
      cadena +="username";
    }
    if(this.password=="" || this.password==" ")
    {
      if(cadena!="") cadena += ", ";
      cadena +="password";
    }

    if(cadena!="")
    {
      Swal.fire({
        icon: 'warning',
        title: 'Datos del usuario',
        text: "Los datos "+cadena+" son obligatorio",
        footer: '<a href="http://localhost:4200/newaccount"></a>'
      })
      return false;
    }
    return true;
  }
}
