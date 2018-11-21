'use strict'

import { Router, Request, Response } from "express";
import * as recommendation from "./controller";


export function init(router: Router){
    
   /*  router.route("/")
        .post(setRecommendation)
        .get(getRecommendations); */

}

function setRecommendation(req:Request,res:Response){
    
    recommendation.setRecommendation(req.body)
        .then(data => {
            res.status(200).send({
                data
            });
        })
        .catch(err => {
            res.status(500).send({
                error: err
            });
        });

}

function getRecommendations(req:Request,res:Response){

    recommendation.getRecommendations()
        .then(data => {
            res.status(200).send({
                data
            });
        })
        .catch(err => {
            res.status(404).send({
                err
            });
        });

}