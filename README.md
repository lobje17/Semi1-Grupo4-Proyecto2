# Semi1-Grupo4-Proyecto2
# Manual de Configuracion
>-Arquitectura : para la implemtacion del proyecto se uso lo que fue docker y docker-compose, nodejs para el backend y angular para el frontend
<p align=center>
     <img src="Images/Arquitectura.png" alt="" width=80%>
</p>

>- Para poder levantar los servicios tanto del backend como frontend se uso docker-compose
<p align=center>
     <img src=".Images/backend_front.png" alt="" width=80%>
</p>
>- - Para la Base de datos de igual forma se uso el docker-compose

<p align=center>
     <img src="Images/BaseDeDatos.png" alt="" width=80%>
</p>


>- - Permisos de los Usuarios

<p align=center>
     <img src="Images/PermisosUsuarios.png" alt="" width=80%>
</p>


>- -  Cognito: Grupos de Usuario

<p align=center>
     <img src="Images/Cognito.png" alt="" width=80%>
</p>

>- -  Lambda: Funcion que va a retornar la lista de los usuarios

<p align=center>
     <img src="Images/Lambda.png" alt="" width=80%>
</p>


>- -  ApiGateway: nos dara el endpoint necesario para consumir nuestra funcion lambda

<p align=center>
     <img src="Images/ApiGateway.png" alt="" width=80%>
</p>

