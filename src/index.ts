'use strict'

import * as express from "express";

let server = express();

server.listen(3000,()=>{
    console.log("escuchando en 3000");
});

server.get("/foo",(req,res)=>{
    console.log("Respondiendo mensaje");
    res.status(200).send({
        hello:"Wolrd"
    });
})