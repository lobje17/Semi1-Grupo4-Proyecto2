import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { peopleInteface } from "../../models/user-interface";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})

export class CrudComponent implements OnInit {

  constructor(public crudService:UserService) { }

  ngOnInit(): void {
    /*this.crudService.GetUser().subscribe((res: any) => {
      this.Person = res;
      console.log(this.Person);      
    })*/
  }

  codUser:  string = "";
  name:     string = "";
  username: string = "";
  password: string = "";
  Person:peopleInteface[] =  [];

  createUser()
  {
    console.log(this.name, this.username, this.password);
    this.codUser = "";
    this.name = "";
    this.username = "";
    this.password = "";
  }
}