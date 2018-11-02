'use strict'

import { Response, Request } from 'express';

export function HelloWorld(req: Request,res:Response) {
    res.status(200).send({
        message: "Ranking list"
    });
}