'use strict'

import { Router } from "express";
import * as recom from "./controller";

export function init(router: Router){
    
    router.route("/")
        .get(recom.getRecommendations);

}