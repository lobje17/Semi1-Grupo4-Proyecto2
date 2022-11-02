import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { userInteface } from "../models/user-interface";
import { map } from "rxjs/operators";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private router:Router, private http: HttpClient) { }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  })

  getPosts(username:number)
  {
    const url = "http://localhost:3005/getPosts";
    return this.http.post<any>(
      url, {
        "username":username
      },
      {
        headers: this.headers
      }
    ).pipe(map(data=>data));
  }
  getLables()
  {
    const url = "http://localhost:3005/Labels";
    return this.http.post<any>(
      url, {
        "username":"username"
      },
      {
        headers: this.headers
      }
    ).pipe(map(data=>data));
  }
  traducir1(data:any)
  {
    const url = "http://localhost:3005/translate1";
    return this.http.post<any>(
      url, {
        "text":data
      },
      {
        headers: this.headers
      }
    ).pipe(map(data=>data));
  }

  traducir2(data:any)
  {
    const url = "http://localhost:3005/translate2";
    return this.http.post<any>(
      url, {
        "text":data
      },
      {
        headers: this.headers
      }
    ).pipe(map(data=>data));
  }

  traducir3(data:any)
  {
    const url = "http://localhost:3005/translate3";
    return this.http.post<any>(
      url, {
        "text":data
      },
      {
        headers: this.headers
      }
    ).pipe(map(data=>data));
  }

  createPost(BASE64:string, CONTENIDO:string, NOMBRE:string, DESCRIPCION:string,IdUsuario: number)
  {

    const url = "http://localhost:3005/Publicacion";
    return this.http.post<any>(
      url, {
        "BASE64":BASE64,
        "CONTENIDO":CONTENIDO,
        "NOMBRE":NOMBRE,
        "DESCRIPCION":DESCRIPCION,
        "IdUsuario" : IdUsuario
      },
      {
        headers: this.headers
      }
    ).pipe(map(data=>data));
  }

  searchPost(username:string, tag:string)
  {
    const url = "http://localhost:5000/searchPost";
    return this.http.post<any>(
      url, {
        "username":username,
        "tag":tag
      },
      {
        headers: this.headers
      }
    ).pipe(map(data=>data));
  }
}
