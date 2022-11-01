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

  constructor(private router:Router, private service:UserService, private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
  }

  name:string     = "";
  username:string = "";
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
      this.service.CreateUser(this.name, this.username, this.password, this.picture).subscribe((res)=>
      {
        if(res['ok'])
        {
          if(this.picture.includes(".")) this.uploadFile();
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
    if(this.username=="" || this.username==" ")
    {
      if(cadena!="") cadena += ", ";
      cadena +="username";
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
    /*
    const { value: file } = await Swal.fire({
      title: 'Select image',
      input: 'file',
      inputAttributes: {
        'accept': 'image/*',
        'aria-label': 'Upload your profile picture'
      }
    })

    let pic:any;
    if (file) {
      const reader = new FileReader()
        console.log("pic")
        console.log(file)
        
        reader.readAsDataURL(file)
        this.picture = file['name'];
        Swal.fire({
          title: 'Your uploaded picture',
          imageUrl: this.picture,
          imageAlt: 'The uploaded picture'
        })
      }*/
    
    const getPath = event.target.files[0];
    this.picture = getPath['name'];    
    
    this.extraerBase64(getPath).then((imagen:any) =>{
      this.previsualizacion = imagen.Base;
    })
    this.archivos.push(getPath);
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
