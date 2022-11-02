import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { postInterface } from 'src/app/models/post-interface';
import { userInteface } from 'src/app/models/user-interface';
import { users } from 'src/app/models/user-interface';
import { PostsService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private router:Router, private serviceU:UserService, private serviceP:PostsService) { }
  public listPost:postInterface[] = [];
  public listRequest:users[] = [];
  public listUser:users[] = [{
    name: "Primero",
    picture:"jajajaj"
  }];
  public search:string = "";
  ejecutar:number = 0;


  ngOnInit(): void
  {
    this.listUser.push({
      name: "Segundo",
      picture:"jajajaja2"
    });
    this.listUser.push({
      name: "Segundo",
      picture:"jajajaja2"
    });
    this.listUser.push({
      name: "Segundo",
      picture:"jajajaja2"
    });
    this.listUser.push({
      name: "Segundo",
      picture:"jajajaja2"
    });
    this.listUser.push({
      name: "Segundo",
      picture:"jajajaja2"
    });
    this.listUser.push({
      name: "Segundo",
      picture:"jajajaja2"
    });
    this.listUser.push({
      name: "Segundo",
      picture:"jajajaja2"
    });
    this.listUser.push({
      name: "Segundo",
      picture:"jajajaja2"
    });
    this.listUser.push({
      name: "Segundo",
      picture:"jajajaja2"
    });
    console.log(this.listUser);
    // LINEA PARA CARGAR LA LISTA USUARIOS
    //if(this.ejecutar==0)this.updatePosts();
  }

  updatePosts()
  {
    let u:userInteface = this.serviceU.getCurrentStorage();
    this.serviceP.getPosts(u.username).subscribe((res)=>
    {
      //console.log(res);
      this.listPost = res['data'];
      console.log(this.listPost);
    })
  }

  updateListUser()
  {
    let u:userInteface = this.serviceU.getCurrentStorage();
    this.serviceP.getPosts(this.serviceU.getId()).subscribe((res)=>
    {
      //console.log(res);
      this.listUser = res['data'];
      console.log(this.listUser);
    })
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

  goPageAccount()
  {
    this.router.navigate(['account']);
  }

  singOut()
  {
    this.serviceU.singOut();
  }

}
