# Microservicio: Recommendations

## Propósito del microservicio

La finalidad de este microservicio es obtener datos proporcionados por *Orders* y generar recomendaciones de artículos que a los compradores probablemente les interese comprar.

En un principio, las recomendaciones estan dadas por grupos de artículos **[colección]**, definidos por el usuario *administrador*, lo cual, _Recommendations_ determina si el articulo comprado por un usuario (detallado en un *Order*), esta dentro de una **colección**, y expone un articulo aleatorio de esa **colección** o todos los artículos dentro de esta. 

La notificación de dicha recomendación se realiza a traves de:
+ Devolución de un json con articulo/s recomendados **(sync)**
+ Enviar un e-mail al usuario, utilizando el microservicio *Mail notifications* **(async)**

## Casos de uso

+ Es el encargado de organizar las colecciones de artículos, y devolver recomendaciones.
+ El usuario administrador es quién define las colecciones
+ Recibe arreglos de artículos para definir una colección
+ Se escucha el topic = "order_placed". Se determina el articulo del *order* para saber a que colección pertenece
+ Se puede retornar uno o todos los artículos de la colección menos el artículo con la cual se determinó la colección.
+ También pueden obtenerse las recomendaciones, pasando el artículo al microservicio.
+ Devuelve lo/s artículo/s por JSON
+ Envía un mail con lo/s artículo/s mediante *Mail notifications*

# APIDOC

## Resource: Collection

### SetCollection

*Route*

    POST /v1/recomm/collection
---
*Body*
```js
{
    collectionName: "{Collection Name}",
    articles: [
        id: "{Article Id}",
        ....
    ]
}
```
---
*Response*
```js
{
    _id: "{Collection Id}",
    articles: ["{Articles Id}",...],
    enabled: true|false,
    created: "{Creation date}",
    update: "{Last update date}"
}
```
---
*Error Response*

    HTTP/1.1 400 Bad Request
```js
{
    error:{
        message: "{Motivo del error}",
        path: "{Nombre de la propiedad}"
    }
}
```
---
    HTTP/1.1 500 Internal Server Error
```js
{
    error: "Not found"
}
```

### GetCollection

*Route*

    GET /v1/recomm/collection/:collection_id
---
*Response*
```js
{
    _id: "{Collection Id}",
    articles: ["{Articles Id}",...],
    enabled: true|false,
    created: "{Creation date}",
    update: "{Last update date}"
}
```
---
*Error Response*

    HTTP/1.1 400 Bad Request
```js
{
    error:{
        message: "{Motivo del error}",
        path: "{Nombre de la propiedad}"
    }
}
```
---
    HTTP/1.1 500 Internal Server Error
```js
{
    error: "Not found"
}
```

## Resource: Recommendation

### GetRandomRecommendation / GetAllRecommendations

*Route*

    GET /v1/recomm/random
    GET /v1/recomm/all
---
*Response*
```js
{
    articles: "{Articles Id}" /*solo un artículo al azar*/,
    collection: "{Collection Id}"
}
```
```js
{
    articles: ["{Articles Id}",...] /*todos los artículos de la colección menos con el que se busco la colección*/,
    collection: "{Collection Id}"
}
```
---
*Error Response*

    HTTP/1.1 400 Bad Request
```js
{
    error:{
        message: "{Motivo del error}",
        path: "{Nombre de la propiedad}"
    }
}
```
---
    HTTP/1.1 500 Internal Server Error
```js
{
    error: "Not found"
}
```

### SendEmail (async) -> MailNotifications Microservice

*Route*

    GET /v1/recomm/random/mail
    GET /v1/recomm/all/mail
---
*Response*
```js
{
    message: "E-mail siendo procesado"
}
```
---
*Error Response*

    HTTP/1.1 400 Bad Request
```js
{
    error:{
        message: "{Motivo del error}",
        path: "{Nombre de la propiedad}"
    }
}
```
---
    HTTP/1.1 500 Internal Server Error
```js
{
    error: "Couldnt send email"
}
```

