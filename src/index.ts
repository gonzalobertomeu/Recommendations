'use strict'

import * as express from "express";

let server = express();

server.get("/foo",function(req,res){
    console.log("Peticion por /foo");
    res.status(200).send({
        Hola:"Mundo"
    });
});


server.listen(3000,()=>{
    console.log("Escuchando en puerto 3000");
});