import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { userInteface } from "../models/user-interface";
import { map, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  images:any;
  multipleImages = [];
  private httpClient: any;
  constructor(private router:Router, private http: HttpClient) { }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  })

  // GET
  GetUser()
  {
    const url = "http://localhost:5000/getUsers";
    return this.http.get(url);
  }

  LogIn(username:string, password:string)
  {
    const url = "http://localhost:3005/login";
    return this.http.post<any>(
      url, {
        "username":username,
        "password":password
      },
      {
        headers: this.headers
      }
    ).pipe(map(data=>data));
  }
  public UploadFile(data : any){
    const url = "http://localhost:3005/SubirArchivo";
    return this.http.post<any>(
      url, data,
      {
        headers: this.headers
      }
    ).pipe(map(data=>data));
  }

  CreateUser(nombreUsuario:string, correo:string, contrasenia:string, fotoURL:string)
  {
    const url = "http://localhost:3005/Registro";
    return this.http.post<any>(
      url, {
        "nombreUsuario":nombreUsuario,
        "correo":correo,
        "contrasenia":contrasenia,
        "fotoURL":fotoURL
      },
      {
        headers: this.headers
      }
    ).pipe(map(data=>data));
  }

  UpdateInf(name:string, username:string, bot_mode:number, picture:string, password:string)
  {
    const url = "http://localhost:5000/updateInfo";
    return this.http.post<any>(
      url, {
        "name":name,
        "username":username,
        "bot_mode":bot_mode,
        "picture":picture,
        "password":password
      },
      {
        headers: this.headers
      }
    ).pipe(map(data=>data));
  }

  upload(formPicture:FormData)
  {
    const url = "http://localhost:5000/upload";
    return this.http.post<any>(
      url,
      formPicture
    ).pipe(map(data=>data));
  }

  setCurrentUser(user:userInteface)
  {
    localStorage.setItem('User_logger', JSON.stringify(user));
  }

  getCurrentStorage()
  {
    let user_s:any = localStorage.getItem('User_logger');

    if(user_s != null && user_s != undefined) return JSON.parse(user_s);
    return null;
  }
  getId() : number
  {
    let user_s:any = localStorage.getItem('User_logger');
    let data = JSON.parse(user_s);
    return data.dataUser[0].Personid;
  }
  getName() : String
  {
    let user_s:any = localStorage.getItem('User_logger');
    let data = JSON.parse(user_s);
    return data.dataUser[0].nombreUsuario;
  }
  getURL() : String
  {
    let user_s:any = localStorage.getItem('User_logger');
    let data = JSON.parse(user_s);
    return data.dataUser[0].fotoperfil;
  }


  singOut()
  {
    localStorage.removeItem('User_logger');
    this.router.navigate(['login'])
    this.show_message('success', 'Sesion terminada');
  }

  show_message(tipo:any, info:string)
  {
    Swal.fire({
            icon: tipo,
            title: 'Usuario',
            text: info,
            footer: ''
          })
  }
}
