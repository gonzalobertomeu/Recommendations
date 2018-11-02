import { Router } from 'express';
import * as ranking from './controller';

export function init(router: Router){

    router.route("/ranking")
        .get(ranking.HelloWorld);

}
