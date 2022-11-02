import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { peopleInteface } from "../../models/user-interface";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})

export class CrudComponent implements OnInit {
  public users : any;
  constructor(public crudService:UserService) { }

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

  createUser()
  {
    console.log(this.name, this.username, this.password);
    this.codUser = "";
    this.name = "";
    this.username = "";
    this.password = "";
  }
}
