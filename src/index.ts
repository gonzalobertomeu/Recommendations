'use strict'

import * as express from "./utils/express.factory";
import * as mongoose from "mongoose";
import * as rabbitRecommendation from './rabbit/rabbit';
import { getConfig, Config } from "./utils/configs";

let config: Config = getConfig(process.env);
console.log(config);

mongoose.connect(`mongodb://${config.mongo}/test`,function(err: any){
    if (err) {
        console.error("No se pudo conectar a mongo");
    } else {
        console.log("Mongo conectado");
    }
});

rabbitRecommendation.init();

let server = express.init(config);

server.listen(config.port,()=>{
    console.log("Escuchando en puerto 3000");
});