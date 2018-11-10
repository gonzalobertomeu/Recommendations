'use strict'

import * as express from "./utils/express.factory";
import * as mongoose from "mongoose";
import * as rabbitRecommendation from './rabbit/rabbit';


mongoose.connect('mongodb://db/test',function(err: any){
    if (err) {
        console.error("No se pudo conectar a mongo");
    } else {
        console.log("Mongo conectado");
    }
});

rabbitRecommendation.init();

let server = express.init();

server.listen(3000,()=>{
    console.log("Escuchando en puerto 3000");
});