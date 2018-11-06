'use strict'

import { RabbitDirectConsumer, IRabbitMessage, RabbitProcessor } from "./directConsumer";
import { setRecommendation,RecommendationRequest } from "../recommendations/controller";

export function init(){

    const recommendation = new RabbitDirectConsumer("recommendation","recommendation");
    recommendation.addProcessor("set-recom",processSetRecommendation);
    recommendation.init();

}

async function processSetRecommendation(incoming: IRabbitMessage) {
    console.log("Procesando recommendation");
    try {
        let body = incoming.message as RecommendationRequest;
        let resultado = await setRecommendation(body);

        console.log(`Guardado: user:${body.user}, articles:${body.articles}`);
    } catch (error) {
        console.error(error);
    }
}