'use strict'

import { RabbitDirectConsumer, IRabbitMessage, RabbitProcessor } from "./directConsumer";
import { setRecommendation,RecommendationRequest } from "../recommendations/controller";
import { scorePoint } from "../ranking/controller";
import { IRanking } from "../ranking/schema";

export function init(){

    /* const recommendation = new RabbitDirectConsumer("recommendation","recommendation");
    recommendation.addProcessor("set-recom",processSetRecommendation);
    recommendation.init(); */

    const ranking = new RabbitDirectConsumer("recommendation/catalog","catalog/article-exist");
    ranking.addProcessor("article-exist",processSetRankingFromCatalog);
    ranking.init();

}
/* 
async function processSetRecommendation(userid: string, incoming: IRabbitMessage) {
    console.log("Procesando recommendation");
    try {
        let body = incoming.message as RecommendationRequest;
        let resultado = await setRecommendation(body);

        console.log(`Guardado: user:${body.user}, articles:${body.articles}`);
    } catch (error) {
        console.error(error);
    }
} */

async function testCatalog (incoming:IRabbitMessage,userid:string){
    console.log("Testeando ranking");
    try {
        console.log(userid);
        const msg = incoming.message as CatalogArticleExistMessage;
        const body = {
            owner: userid,
            article: msg.articleId
        }as IRanking;

        console.log("Rabbit recibido. Mostrando:")
        console.log(body);

    } catch (error) {
        
    }
}

async function processSetRankingFromCatalog (incoming: IRabbitMessage, userid: string,){
    console.log("Procesando ranking");
    try {

        console.log(userid);
        const msg = incoming.message as CatalogArticleExistMessage;
        const body = {
            owner: userid,
            article: msg.articleId
        } as IRanking;

        const result = await scorePoint(body);
        console.log("Guardando puntacion");
        console.log(result);

        
    } catch (error) {
        console.log("Error al guardar");
        console.log(error);
    }
}

interface CatalogArticleExist {
    "type": string,
    "message": CatalogArticleExistMessage
}
interface CatalogArticleExistMessage {
    "cartId": string,
    "articleId": string,
    "valid": boolean
}