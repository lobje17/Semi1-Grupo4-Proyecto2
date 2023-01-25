import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from "./components/account/account.component";
import { ChatComponent } from "./components/chat/chat.component";
import { CrudComponent } from "./components/crud/crud.component";
import { HomeComponent } from "./components/home/home.component";
import { InformationComponent } from "./components/information/information.component";
import { LoginComponent } from "./components/login/login.component";
import { NewAccountComponent } from "./components/new-account/new-account.component";
import { PublicacionComponent } from './components/publicacion/publicacion.component';
import { VigilanteGuard } from './guards/vigilante.guard';

const routes: Routes = [
  {
    path: 'account',
    component: AccountComponent,
    //canActivate: [VigilanteGuard]
  },
  {
    path: 'chat',
    component: ChatComponent,
    //canActivate: [VigilanteGuard]
  },
  {
    path: 'crud',
    component: CrudComponent,
    //canActivate: [VigilanteGuard]
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'updateinfo',
    component: InformationComponent,
    //canActivate: [VigilanteGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'newaccount',
    component: NewAccountComponent
  },
  {
    path: 'publicacion',
    component: PublicacionComponent,
    //canActivate: [VigilanteGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
