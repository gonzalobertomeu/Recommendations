'use strict'

import * as dotenv from "dotenv";

let config: Config;

export function getConfig(environment:any){

    if (!config){
        dotenv.config();

        config = {
            port: process.env.PORT || "3000",
            mongo: process.env.MONGO || "db",
            rabbit: process.env.RABBIT || "rmq",
            version: process.env.VERSION || "1"
        }
    }

    return config;

}

export interface Config {
    port: string,
    mongo: string,
    rabbit: string,
    version: string
}