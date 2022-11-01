import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css']
})
export class NewAccountComponent implements OnInit {
  archivocargado:File | undefined;
  photo2 : string | ArrayBuffer | any;
  constructor(private router:Router, private service:UserService, private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
  }

  name:string     = "";
  email:string = "";
  picture:string  = "";
  password:string = "";
  confirm_password:string = "";
  public archivos:any = [];
  public previsualizacion: string = "";

  NewAccount()
  {
    if(!this.fields_filled()) return;
    if(this.password == this.confirm_password)
    {
      this.service.CreateUser(this.name, this.email, this.password, this.photo2).subscribe((res)=>
      {
        if(res.status == '200')
        {
          this.service.show_message('success', res['data'])
          this.router.navigate(['login'])
        }
        else this.service.show_message('error', res['data'])
      })
    }

    else this.service.show_message('warning', 'Su contraseña no coincide!')
  }

  /* CAMPOS LLENOS */
  fields_filled()
  {
    let cadena = "";
    if(this.name=="" || this.name==" ")
    {
      if(cadena!="") cadena += ", ";
      cadena +="name";
    }
    if(this.email=="" || this.email==" ")
    {
      if(cadena!="") cadena += ", ";
      cadena +="email";
    }
    if(this.password=="" || this.password==" ")
    {
      if(cadena!="") cadena += ", ";
      cadena +="password";
    }
    if(this.confirm_password=="" || this.confirm_password==" ")
    {
      if(cadena!="") cadena += ", ";
      cadena +="confirm password";
    }

    if(cadena!="")
    {
      this.service.show_message('warning',"Los datos "+cadena+" son obligatorio");
      return false;
    }
    return true;
  }

  async getPicture(event:any)
  {

    this.archivocargado = event.target.files[0];
    let reader = new FileReader();
    // @ts-ignore
    reader.readAsDataURL(this.archivocargado);
    // @ts-ignore
    let nameImage = this.archivocargado.name.toString();
    let filetype = this.archivocargado?.type.toString();
    let filebase64:any = "";

    reader.onload = ( event2:any ) => {
      filebase64 = reader.result?.toString();
      filebase64 = filebase64.replace(/data:.+?,/, "");
      this.photo2 = filebase64;
      let dataImage = {
        "PUBLICO" : 1,
        "IdUsuario" : 1,
        NOMBRE : nameImage,
        CONTENIDO : filetype,
        BASE64 : filebase64
      };
      /*this.service.UploadFile(dataImage).subscribe((result: { downloadURL: any; }) => {
        this.photo2 = result.downloadURL;
        console.log(result.downloadURL);
      }, (err: any) => {
        console.log(err);
      });*/
    }

  }

  extraerBase64 = async($event:any)=>new Promise((resolve, reject) =>
  {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();

      reader.readAsDataURL($event);
      reader.onload = ()=>
      {
        resolve({
          //Blob: $event,
          //image,
          Base: reader.result
        });
      }

      reader.onerror = error =>
      {
        resolve({
          //Blob: $event,
          //image,
          Base: null
        });
      }

    } catch (error) {
      console.log(error);
    }
  })

  uploadFile()
  {
    try {
      const formPicture = new FormData();
      this.archivos.forEach((archivo:any) =>
      {
        formPicture.append('myfile', archivo);
      });

      this.service.upload(formPicture).subscribe((res)=>{
        console.log(res);
      })
    } catch (error) {
      console.log(error);
    }
  }
}
