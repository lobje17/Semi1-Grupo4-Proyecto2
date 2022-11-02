import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { peopleInteface } from "../../models/user-interface";
import {delay} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})

export class CrudComponent implements OnInit {
  public users : any;
  constructor(private router:Router,public crudService:UserService) { }

  ngOnInit(): void {
    this.crudService.GetUser().subscribe((res: any) => {
      this.users = res.data;
    })
  }

  codUser:  string = "";
  name:     string = "";
  username: string = "";
  password: string = "";
  Person:peopleInteface[] =  [];
  agregarAmigo(id:number){
    this.crudService.AgregarAmigo(this.crudService.getId(),id).subscribe((res)=>
    {
      console.log(res);
      if(res.status == '200')
      {
        delay(100000000)
        this.crudService.show_message('success', res);
      }
    })
  }
  account(){
    this.router.navigate(['account']);
  }
  createUser()
  {
    console.log(this.name, this.username, this.password);
    this.codUser = "";
    this.name = "";
    this.username = "";
    this.password = "";
  }
}
