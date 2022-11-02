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
  public listLabels: any;
  public search:string = "";
  ejecutar:number = 0;
  public flagLabel = "todoss";
  public flag = "todo";
  public visible = false;
  public visible2 = false;
  public visibleTrad = false;
  public dataTrad : any;

  ngOnInit(): void
  {
    if(this.ejecutar==0)this.updatePosts();
    this.serviceP.getLables().subscribe((res)=>
    {
      //console.log(res);
      this.listLabels = res.data;
      console.log(this.listLabels);
    })
  }
  filterLabel(name:any){
      this.flag = name;
      this.flagLabel = name;
      this.visible = false;
      this.visible2 = true;
  }
  filterLabel2(){
    this.visible = true;
    this.visible2 = false;
  }
  TraducirIngles_Espaol(data:any){
    this.serviceP.traducir1(data).subscribe((res)=>
    {
      console.log(res);
      this.dataTrad =  res.message.TranslatedText;

      this.visibleTrad = true;
    })
  }
  TraducirEspaol_Ingles(data:any){
    this.serviceP.traducir2(data).subscribe((res)=>
    {
      console.log(res);
      this.dataTrad = res.message.TranslatedText;
      this.visibleTrad = true;
    })
  }
  TraducirEspaol_Aleman(data:any){
    this.serviceP.traducir3(data).subscribe((res)=>
    {
      console.log(res);
      this.dataTrad = res.message.TranslatedText;
      this.visibleTrad = true;
    })
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
    this.router.navigate(['crud']);
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
