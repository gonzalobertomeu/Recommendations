'use strict'

import * as express from "./utils/express.factory";
import * as mongoose from "mongoose";


mongoose.connect('mongodb://mongodb/test',function(err: any){
    if (err) {
        console.error("No se pudo conectar a mongo");
    } else {
        console.log("Mongo conectado");
    }
})

let server = express.init();

server.listen(3000,()=>{
    console.log("Escuchando en puerto 3000");
});