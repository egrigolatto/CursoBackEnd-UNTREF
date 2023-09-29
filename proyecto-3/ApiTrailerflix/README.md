# Proyecto Integral N°3

El presente documento, es el **Proyecto Integral N°3** de ***Argentina Program 4.0***. Esta es una pequeña solución informática de tipo CRUD (create, read, update, delete) para administrar un catalogo de series y peliculas alojados en una base de datos de tipo relacional.
La misma, fue diseñada y construida sobre una arquitectura API RESTful, la cual está desarrollada bajo las restricciones y recomendaciones de REST, además, implementa buenas prácticas de programación.

#### Especificaciones
- Servidor: http://localhost:8080
- Autor: Grigolatto Emanuel Andres
- Versión: 1.0.0

#### Requerimientos o dependencias
- Node.js v18.16.1
- Express v4.18.2
- Dotenv v16.3.1
- Sequelize v6.32.1
- mysql2 v3.6.0
- GIT v2.40.1
- IDE - Visual Studio Code v1.78.2

#### Estructura de directorios
``` tree
    ├── node_modules
    ├── src
    |   └── connection
    |   |    └── connection.js
    |   └── funciones
    |   |    └── mapear.js
    |   └── modelos
    |   |    └── actores.js
    |   |    └── categorias.js
    |   |    └── contenidos_actores.js
    |   |    └── contenidos_generos.js
    |   |    └── contenidos.js
    |   |    └── generos.js
    |   |    └── index.js
    |   |    └── vista.js
    |   └── routes
    |   |    └── catalogo.js
    |   |    └── vista.js
    │   └── server.js
    ├── .env
    ├── .env.dist
    ├── .gitignore
    ├── package.json
    ├── package-lock.json 
    └── README.md
```

---
### CONFIGURACION DE ENTORNO
  - #### VARIABLES DE ENTORNO
    Se debe hacer una copia del archivo **.env.dist** y renombrarlo como **.env**. Con respecto a su contenido, es necesario asignar los valores a correspondientes a las variables:
    ``` js
        PORT=8080
        HOST=localhost

        DATABASE=trailerflix
        DBUSER=mi-user
        PASSWORD=mi-clave
    ```

- #### ERRORES & FORMATOS
    La comprobación de errores y formatos se ejecuta por medio del comando ***npm run eslint***. se hace por medio de Eslint. Para visualizar los errores en tiempo de escritura, se debe tener instalada la extensión de **Eslint** en Visual Studio Code.
    
---
### MÓDULO DE CATALOGO

Este módulo permite la gestión de contenidos(peliculas y series). Ofrece funciones para agregar, modificar, borrar o leer el registro. Además, permite visualizar reportes filtrados por diferentes criterios de búsqueda.

#### Métodos HTTP
| Tipo | URI | Descripción |
|------|-----|-------------|
| GET | http://localhost:8080/catalogo | Obtiene todo el registro del catalogo |
| GET | http://localhost:8080/catalogo/1 | Obtiene un registro en específico por su id |
| GET | http://localhost:8080/catalogo/titulo/chernobyl | Obtiene un registro por su titulo |
| GET | http://localhost:8080/catalogo/genero/terror | Obtiene un registro por su genero |
| GET | http://localhost:8080/catalogo/actor/pedro | Obtiene un registro por el nombre de algun actor del reparto |
| GET | http://localhost:8080/catalogo/categorias/pelicula | Obtiene un registro por su categoria |
| POST | http://localhost:8080/catalogo | Crea un nuevo registro |
| PUT | http://localhost:8080/catalogo/1 | Modifica un registro en específico |
| DELETE | http://localhost:8080/catalogo/1 | Elimina un registro en específico |


#### Método GET:
- Request:
  - Parámetros URL opcionales que puede recibir:
    - /catalogo (traera todo el catalogo en formato json)
  
    - /catalogo/:id *(:id: tipo: integer )*
    - catalogo/titulo/:titulo *(:titulo tipo: string)*
    - catalogo/genero/:genero *(:genero tipo: string)*
    - catalogo/actor/:actor *(:actor tipo: string)*
    - catalogo/categorias/:categoria *(:categoria tipo: string)*
- Response:
    ``` json
        [
             {
                "id": 2,
                "poster": "http://catalogo/serie/riverdale/posters/2.jpg",
                "titulo": "Riverdale",
                "categoria": "Serie",
                "genero": "Drama, Misterio, Ciencia Ficción",
                "resumen": "El paso a la edad...",
                "temporadas": 5,
                "reparto": "Lili Reinhart, Casey Cott,...",
                "trailer": null
             }
        ]
    ```
  - Código HTTP: **200 OK** *{ contenido }*
  - Código HTTP: **400 Bad Request** *message: 'parametro ingresado no valido'*
  - Código HTTP: **404  Not Found** *message: 'no hubo coincidencias con el parametro ingresado'*
  - Código HTTP: **500  Internal Server Error** *message: Se ha generado un error en el servidor*


#### Método POST:
- Request:
  - Parámetros requeridos del BODY:
    - poster=/miposter/2.jpg *(tipo: string)* 
    - titulo=Indiana Jones *(tipo: string)* 
    - categoria=Pelicula *(tipo: string)* 
    - genero=Aventura *(tipo: string)*
    - resumen=resumen *(tipo: string)*
    - temporadas=0 *(tipo: integer)*
    - reparto=Harrison Ford *(tipo: string)*
    - trailer=http//:tarile *(tipo: string)*
- Response:
  - Código HTTP: **201 Created** *message: 'contenido creado', nuevoContenido*
  - Código HTTP: **400 Bad Request** *message: Faltan datos requeridos*
  - Código HTTP: **500 Internal Server Error** *message: Se ha generado un error en el servidor*



#### Método PUT:
- Request:
  - Parámetro obligatorio de tipo URL:
    - :id *(tipo: integer. Indica el código del contenido a modificar)*
  - Parámetros requeridos del BODY:
    - poster=/miposter/2.jpg *(tipo: string)* 
    - titulo=Indiana Jones *(tipo: string)* 
    - categoria=Pelicula *(tipo: string)* 
    - genero=Aventura *(tipo: string)*
    - resumen=resumen *(tipo: string)*
    - temporadas=0 *(tipo: integer)*
    - reparto=Harrison Ford *(tipo: string)*
    - trailer=http//:tarile *(tipo: string)* 
- Response:
  - Código HTTP: **200 OK** *message: 'contenido actualizado', contenidoExistente*
  - Código HTTP: **404 Not Found** *error: contenido no encontrado*
  - Código HTTP: **500 Internal Server Error** *message: Se ha generado un error en el servidor*


#### Método DELETE:
- Request:
  - Parámetro obligatorio de tipo URL:
    - :id *(tipo: integer. Indica el código del contenido a eliminar)*
- Response:
  - Código HTTP: **204 No Content** *message: 'contenido eliminado'*
  - Código HTTP: **404 Not Found** *error: contenido no encontrado*
  - Código HTTP: **500** *message: Se ha generado un error en el servidor*

### MÓDULO DE VISTA

Este modulo traera todo el catalogo de contendios, esta generado a traves de la view SQL solicitada en el punto 2 de este trabajo. 

#### Métodos HTTP
| Tipo | URI | Descripción |
|------|-----|-------------|
| GET | http://localhost:8080/vista | Obtiene todo el registro del catalogo |