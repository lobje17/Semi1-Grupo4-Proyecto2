import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { postInterface } from 'src/app/models/post-interface';
import { userInteface } from 'src/app/models/user-interface';
import { PostsService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';
import {Observable} from "rxjs";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private router:Router, public serviceU:UserService, public serviceP:PostsService) { }
  public listPost: any;
  public search:string = "";
  ejecutar:number = 0;

  ngOnInit(): void
  {
    if(this.ejecutar==0)this.updatePosts();
  }

  updatePosts()
  {
    this.serviceP.getPosts(this.serviceU.getId()).subscribe((res)=>
    {
      //console.log(res);
      this.listPost = res.data;
      console.log(res.data);
    })
  }
  getImage(): String {
    return this.serviceU.getURL();
  }

  searchPost()
  {
    let u:userInteface = this.serviceU.getCurrentStorage();
    if(this.search!="")
    {
      this.serviceP.searchPost(u.username, this.search ).subscribe((res)=>
      {
        if(res['ok'])
        {
          this.listPost = res['data'];
          //console.log(res);
          //console.log(this.listPost);
          this.ejecutar = 1;
          this.ngOnInit();
          this.ejecutar = 0;
        }
        else
        {
          this.serviceU.show_message('info', res['data']);
          this.listPost = [];
          this.ejecutar = 1;
          this.ngOnInit();
          this.ejecutar = 0;
        }
      })
    }
    else
    {
      this.serviceU.show_message('info', "Debe ingresar un tag para buscar")
      this.ngOnInit();
    }
    //console.log("Esto esta en seach", this.search);
  }

  goPageUpdateInfo()
  {
    this.router.navigate(['updateinfo']);
  }

  goPagePost()
  {
    this.router.navigate(['publicacion']);
  }

  singOut()
  {
    this.serviceU.singOut();
  }
}
