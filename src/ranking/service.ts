'use strict'

import { Router, Request, Response } from 'express';
import * as ranking from './controller';

export function init(router: Router){

    router.route("/ranking")
        .get(getTop);

}

async function getTop(req:Request,res:Response){
    try {
        console.log("Buscando el top");
        let topten = await ranking.getTopTen();

        res.status(200).send(topten);

    } catch (error) {
        res.status(500).send({
            message: error
        });
    }
}
