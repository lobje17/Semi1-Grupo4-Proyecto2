import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { userInteface } from "../../models/user-interface";
import Swal from "sweetalert2";
@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {

  constructor(private router:Router, private service:UserService, private sanitizer:DomSanitizer) { }


  name:string     = "";
  username:string = "";
  picture:string  = "";
  new_picture:string  = "";
  bot_mode:number = 0;
  confirm_password:string = "";
  check1:any;
  
  public archivos:any = [];
  public previsualizacion: string = "";
  public previsualizacion2: string = "";

  ngOnInit(): void 
  {
    let user:userInteface = this.service.getCurrentStorage(); 
    this.updateData(user)

    this.check1 = document.getElementById("flexSwitchCheckDefault");
    if(this.check1.checked) 
    {
      this.check1.checked = true;
      this.bot_mode = 1;
    }
    else 
    {
      this.check1.checked = false;
      this.bot_mode = 0;
    }
  }

  UpdateInformation()
  {
    if(this.confirm_password=="")
    {
      this.show_message('warning', 'Debe ingresar su contraseña para confirmar los cambios');
    }
    else
    {
      /* RECOLECTANDO DATOS PARA ALMACENAR */
      this.fields_filled();
      /* CONSULTA */
      this.service.UpdateInf(this.name, this.username, this.bot_mode, this.picture, this.confirm_password).subscribe((res)=>
      {
        console.log(res);
        
        /* SI ACTUALIZO LOS DATOS */
        if(res['ok'])
        {
          if(this.new_picture != "") this.uploadFile();
          let user:userInteface = res['data'];
          this.updateData(user);
          this.new_picture = "";
          this.previsualizacion = "";
          this.show_message('success', res['info']);
          this.goPageAccount();
        }
        else this.show_message('error', res['info']);
      })
    }
    //else this.show_message('warning', 'Su contraseña no coincide!')

  }

  show_message(tipo:any, info:string)
  {
    Swal.fire({
            icon: tipo,
            title: 'Datos del usuario',
            text: info,
            footer: '<a href="http://localhost:4200/newaccount"></a>'
          }) 
  }

  /* CAMPOS LLENOS */
  fields_filled()
  {
    let user:userInteface = this.service.getCurrentStorage();

    if(this.name=="")        this.name = user.name;
    if(this.username=="")    this.username = user.username;
    if(this.picture=="")     this.picture = user.picture;
    if(this.new_picture!="") this.picture = this.new_picture;
  }

  updateData(user:userInteface)
  {
    this.name = user.name;
    this.username = user.username;
    this.picture = user.picture;
    this.bot_mode = user.bot_mode;
    /* SE INDICA QUE SE PUEDE MOSTRAR */
    if(this.picture!="") this.previsualizacion2=this.picture;
    
    this.check1 = document.getElementById("flexSwitchCheckDefault");
    if(this.bot_mode==1)  this.check1.checked = true;
    else                  this.check1.checked = false;
    this.service.setCurrentUser(user);
  }

  getPicture(event:any)
  {
    if(event.target.files.length>0)
    {
      const getPath = event.target.files[0];
      this.new_picture = getPath['name'];
      
      this.extraerBase64(getPath).then((imagen:any) =>{
        this.previsualizacion = imagen.Base;        
      })
      this.archivos.push(getPath);
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
          console.log('error');
        }          
  }

  modo_bot(event:any)
  {
    if(this.bot_mode == 1) this.bot_mode = 0;
    else this.bot_mode = 1;
  }
  
  goPageAccount()
  {
    this.router.navigate(['account']);
  }

  singOut()
  {
    this.service.singOut();
  }
}
