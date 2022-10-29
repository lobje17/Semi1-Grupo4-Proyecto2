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

  getPosts(username:string)
  {
    const url = "http://localhost:5000/getPosts";
    return this.http.post<any>(
      url, {
        "username":username
      },
      {
        headers: this.headers
      }
    ).pipe(map(data=>data));
  }

  createPost(picture:string, comment:string, tags:string, username:string)
  {

    const url = "http://localhost:5000/createPost";
    return this.http.post<any>(
      url, {
        "picture":picture,
        "coment":comment,
        "tags":tags,
        "username":username
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
