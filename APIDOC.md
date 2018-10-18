# Microservicio: Recommendations

## Propósito del microservicio

La finalidad de este microservicio es obtener datos de otros microservicios [order,cart,catalog] como visitas a un artículo, agregarlo a un carrito, y comprar un artículo. Cada uno de estos eventos da cierta puntuación a ese artículo para ese usuario.

Catalogar y gestionar esta "tabla de puntuaciones de usuario" es la función de este microservicio.
Luego consulta a Catalogo, con el artículo mejor puntuado, y este retorna un arreglo de artículos recomendados (o asociados).
Controla la "precisión" de la recomendación que se va a realizar.

Si un artículo es comprado, se envia automáticamente un mail con las recomendaciones para ese usuario.

## Casos de uso
 
+ Escucha a la cola "article-commend". Los mensajes recibidos tienen un id de articulo y una puntuación según de que evento surge el "elogio" a ese articulo (Buscarlo, agregarlo al carrito o comprarlo).
+ Recommendations se encarga de mantener un ranking de artículos por cada usuario.
+ Se puede solicitar recomendaciones llamando a este servicio.
+ Revisa si el estado de una orden es PAYMENT_DEFINED para realizar una notificación por e-mail.
+ La recomendación es una lista de artículos asociados al artículo del cual se obtuvo dicha recomendación.
+ Si un articulo dentro de la lista es comprado, su puntaje se establece en 0.

# APIDOC

## GetRanking

Da como resultado un ranking general de los articulos mas puntuados.
Cada item del ranking, es la suma de todos los puntajes por usuario, de cada articulo

*Route*

	GET /v1/recommendation/ranking

*Body*
```js
{
	limit: "{default 0}" //cantidad de items del ranking
}
```

---
*Response*
```js
{
articles: [
	{
		_id: "{article id}",
		rank: "{ranking number}",
		score: "{score}"
	}, ...
	]
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
HTTP/1.1 401 Unauthorized
```js
{
error: "Unauthorized"
}
```
---
HTTP/1.1 500 Internal Server Error
```js
{
error: "Not found"
}
```

## GetRecommendations
Da como resultado una lista de articulos recomendados para el usuario que realiza la llamada.

*Route*

	GET /v1/recommendation
---
*Response*
```js
{
articles: ["{articles}"], /*es el json devuelto por catalog*/
precision:  "{precision number}"
}
```
---
*Error Response*

HTTP/1.1 401 Unauthorized
```js
{
error: "Unauthorized"
}
```
---
HTTP/1.1 500 Internal Server Error
```js
{
error: "Not found"
}
```

# RabbitMQ

## GET

Escucha las siguientes colas:

	DIRECT catalog/article-exist

Cada vez que un articulo es validado por catalog, aumenta su puntaje.

*Example*
```js
{
"type": "article-exist",
"message" : {
    "cartId": "{cartId}",
    "articleId": "{articleId}",
    "valid": true|false
   }
}
```

---
	TOPIC order/order-placed

Cada vez que se haga un place de order, se aumenta el puntaje de cada artículo de order.

*Example*

```js
{
"type": "order-placed",
"message" : {
    "cartId": "{cartId}",
    "orderId": "{orderId}"
    "articles": [{
         "articleId": "{article id}"
         "quantity" : "{quantity}"
     }, ...]
   }
}
```
---
## POST

	DIRECT recommendations/new-top

Envia mensajes notificando que ha cambiado el Top10 de productos.
Cola util para marketing, stats, o para la UI de este e-commerce.

*Success Response*

```js
{
 "type": "new-top",
  "message": {
   "articles":[
    {
	 "_id":"article id",
	 "score": "{score}"
	}, ...
   ]
  }
}
```


# Anexo: Descripción Técnica
La precisión se calcula según esta formula:

precisión = 1 / { promedio - ( puntajeMasAlto / promedio ) }

Mientras más cerca de 1, más precisa es la recomendación que se realizará.

Puede obtener en cualquier momento artículos recomendados. Si el cliente confirma una compra [order_placed], el microservicio enviara un mail con los artículos recomendados automáticamente, y establecerá el puntaje de ese artículo en 0. Si se vuelve a buscar ese mismo artículo, su puntaje aumentará y al cabo de un tiempo puede ser nuevamente recomendado.