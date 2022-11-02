import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { userInteface } from "src/app/models/user-interface";
import { UserService } from 'src/app/services/user.service';
import { PostsService } from "src/app/services/posts.service";
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.css']
})
export class PublicacionComponent implements OnInit {
  archivocargado:File | undefined;
  photo2 : string | ArrayBuffer | any;
 constructor(private router:Router, private serviceU:UserService, private serviceP:PostsService, private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
  }

  public archivos:any = [];
  public previsualizacion: string = "";
  picture:string  = "";
  comment:string = "";
  tags:string = "";

  createPost()
  {
    if(this.picture != "")
    {
      let u:userInteface = this.serviceU.getCurrentStorage();
      this.tags = this.tags.toLocaleLowerCase();
      this.tags = this.tags.replace(/ /g, "");
      this.serviceP.createPost(this.photo2.BASE64,this.photo2.CONTENIDO, this.comment, this.tags,this.serviceU.getId()).subscribe((res)=>
      {
        this.uploadFile()
        if(res.status == '200')
        {
          delay(100000000)
          this.serviceU.show_message('success', res);
        }
        else this.serviceU.show_message('error', res);
      })
      //console.log(this.picture,  this.comment, this.tags);
      this.goPageProfile();
    }
    else
    {
        this.serviceU.show_message('warning', 'Para crear una publicación debe agregar una imagen');
    }
  }

  async getPicture(event:any) {
    const getPath = event.target.files[0];
    this.picture = getPath['name'];

    this.extraerBase64(getPath).then((imagen: any) => {
      this.previsualizacion = imagen.Base;
    })
    this.archivos.push(getPath);
    //
    this.archivocargado = event.target.files[0];
    let reader = new FileReader();
    // @ts-ignore
    reader.readAsDataURL(this.archivocargado);
    // @ts-ignore
    let nameImage = this.archivocargado.name.toString();
    let filetype = this.archivocargado?.type.toString();
    let filebase64: any = "";

    reader.onload = (event2: any) => {
      filebase64 = reader.result?.toString();
      filebase64 = filebase64.replace(/data:.+?,/, "");

      let dataImage = {
        "PUBLICO" : 1,
        "IdUsuario" : 1,
        NOMBRE : nameImage,
        CONTENIDO : filetype,
        BASE64 : filebase64
      };
      this.photo2 = dataImage;
    }
  }

  extraerBase64 = async($event:any)=>new Promise((resolve, reject) =>
  {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();

      reader.readAsDataURL($event);
      reader.onload = ()=> { resolve({ Base: reader.result }); }
      reader.onerror = error => { resolve({ Base: null }); }
    }
    catch (error) {
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

      this.serviceU.upload(formPicture).subscribe((res)=>{
        console.log(res);
      })
    } catch (error) {
      console.log(error);
    }
  }

  goPageProfile()
  {
    this.router.navigate(['account']);
  }

  singOut()
  {
    this.serviceU.singOut();
  }
}
