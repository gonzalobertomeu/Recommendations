'use strict'

import * as express from 'express';
import * as bp from 'body-parser';
import * as ranking from '../ranking/service';
import * as recomm from '../recommendations/service';

export function init(): express.Express {
    //Carga de servidor
    let server = express();
    let router = express.Router();
    let version: Number = 1;

    //Carga de middlewares
    server.use(bp.urlencoded({extended:false}));
    server.use(bp.json());

    //Uso de router para control de versiones
    server.use(`/v${version}/recommendation`,router);

    //Carga de modulos
    ranking.init(router);
    recomm.init(router);

    return server;
}
