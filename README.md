# Microservicio: Recommendations
## Proyecto e-commerce / Arquitectura de Microservicios

[Arquitectura de la aplicación](APIDOC.md)

[Proyecto ecommerce](https://github.com/nmarsollier/ecommerce/blob/master/README.md)

## Dependencias:
- RabbitMQ
- MongoDB

## Docker-Compose:

Si se tiene Docker y Docker Compose instalado ejecutar

    docker-compose up


Se cargan 3 servicios:
- RabbitMQ -> 'rmq'
- MongoDB -> 'db'
- Recommendations -> 'recommendations'

Con los nombres de los servicios se puede acceder a ellos por URL dentro del compose.
Por defecto, son los nombres de las variables del archivo .env
