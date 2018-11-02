'use strict'

import { Response, Request } from "express";

export function getRecommendations(req:Request,res:Response){
    res.status(200).send({
        message: "Recommendations articles"
    });
}