'use strict'

import { Response } from "express";

export function handleError(res: Response ,error:any){
    console.log(error);
        if(error.status){
            let numstat = error.status as number;
            res.status(numstat).send({
                error: numstat,
                message: error.message
            });
        }
}