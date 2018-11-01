'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
let server = express();
server.listen(3000, () => {
    console.log("escuchando en 3000");
});
server.get("/foo", (req, res) => {
    console.log("Respondiendo mensaje");
    res.status(200).send({
        hello: "Wolrd"
    });
});
//# sourceMappingURL=index.js.map