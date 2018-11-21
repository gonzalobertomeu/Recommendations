'use strict'

import { Router, Request, Response } from 'express';
import { handleError } from "../utils/error";
import * as ranking from './controller';

export function init(router: Router){

    router.route("/ranking")
        .get(getTop);

    router.route("/:user_id")
        .get(getRecommendation);

}

async function getTop(req:Request,res:Response){
    try {
        console.log("[GET](/ranking)");
        let limit = parseInt(req.query.limit);
        if(limit < 0 || !limit){
            limit = 10;
        }
        let topten = await ranking.getTopTen();

        topten.sort(function(a,b){
            return  b.score - a.score
        });

        res.status(200).send(topten.slice(0,limit));

    } catch (error) {
        handleError(res,error);
    }
}

async function getRecommendation(req: Request, res: Response){
    try {
        const userId = req.params.user_id;
        let limit = parseInt(req.query.limit);

        if(limit < 0){
            limit = 10;
        }

        console.log("[GET](/)");

        if (!userId){
            throw {status:401,message: "No user id"}
        }
        let recommendations = await ranking.getUserRecommendation(userId as string, limit);

        console.log(recommendations);

        res.status(200).send(recommendations);
    } catch (error) {
        handleError(res,error);
    }
}
