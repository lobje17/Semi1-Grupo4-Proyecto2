import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CrudComponent } from './components/crud/crud.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NewAccountComponent } from './components/new-account/new-account.component';
import { AccountComponent } from './components/account/account.component';
import { ChatComponent } from './components/chat/chat.component';
import { InformationComponent } from './components/information/information.component';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { PostsService } from "./services/posts.service";
import { UserService } from "./services/user.service";
import { PublicacionComponent } from './components/publicacion/publicacion.component';

@NgModule({
  declarations: [
    AppComponent,
    CrudComponent,
    HomeComponent,
    LoginComponent,
    NewAccountComponent,
    AccountComponent,
    ChatComponent,
    InformationComponent,
    PublicacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    PostsService,
    UserService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
