'use strict'

import * as express from "./utils/express.factory";

let server = express.init();

server.listen(3000,()=>{
    console.log("Escuchando en puerto 3000");
});