# Microservicio: Recommendations

## Propósito del microservicio

La finalidad de este microservicio es obtener datos de otros microservicios [order,cart] como visitas a un artículo, agregarlo a un carrito, y comprar un artículo. Cada uno de estos eventos da cierta puntuación a ese artículo para ese usuario.

Catalogar y gestionar esta “tabla de puntuaciones de usuario” es la función de este microservicio.
Luego consulta a Catalogo, con el artículo mejor puntuado, y este retorna un arreglo de artículos recomendados (o asociados).
Controla la “precisión” de la recomendación que se va a realizar. La precisión se calcula según esta formula:

precisión = 1 / { promedio - ( puntajeMasAlto / promedio ) }

Mientras más cerca de 1, más precisa es la recomendación que se realizará.

Puede obtener en cualquier momento artículos recomendados. Si el cliente confirma una compra [order_placed], el microservicio enviara un mail con los artículos recomendados automáticamente, y establecerá el puntaje de ese artículo en 0. Si se vuelve a buscar ese mismo artículo, su puntaje aumentará y al cabo de un tiempo puede ser nuevamente recomendado.

## Casos de uso

Escucha a la cola “article-commend”. Los mensajes recibidos tienen un id de articulo y una puntuación según de que evento surge el “elogio” a ese articulo (Buscarlo, agregarlo al carrito o comprarlo).
Recommendations se encarga de mantener un ranking de artículos por cada usuario.
Se puede solicitar recomendaciones llamando a este servicio.
Revisa si el estado de una orden es PAYMENT_DEFINED para realizar una notificación por e-mail.
La recomendación es una lista de artículos asociados al artículo del cual se obtuvo dicha recomendación.
Si un articulo dentro de la lista es comprado, su puntaje se establece en 0.

# APIDOC

## GetRanking

*Route*

GET /v1/recommendation/ranking
---
*Response*
```js
{
articles: [
	{
	_id: “{article id}”,
	rank: “ranking number”
	}
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
---
HTTP/1.1 500 Internal Server Error
```js
{
error: "Not found"
}
```

## GetRecommendations

*Route*

GET /v1/recommendation
---
*Response*
```js
{
articles: [“{articles}”], //es el json devuelto por catalog
precision:  “{precision number}”
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

