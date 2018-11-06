'use strict'

import { Recommendation, IRecommendation } from "./schema";

export interface RecommendationRequest {
    user?: String,
    articles?: Number,
}
export async function setRecommendation(body:RecommendationRequest): Promise<IRecommendation>{

    try{
        let recom = new Recommendation();
        body = await validateRecommendation(body);
        
        recom.setUser(body.user);
        recom.setArticle(body.articles);

      /*   if (body.user && body.user!=""){
            recom.user = body.user;
        } else{
            throw {error: "no user"}
        }
        if (body.articles && body.articles > 0) {
            recom.articles = body.articles;
        } else{
            throw {error: "no articles"}
        } */

        return new Promise<IRecommendation>(function(resolve,reject){
            recom.save(function(err){
                if (err) return reject(err);

                resolve(recom);
            });
        });
        
    }catch (err) {
        return Promise.reject(err);
    }


} 



function validateRecommendation(body:RecommendationRequest): Promise<RecommendationRequest>{
    //console.log("Validando...");
    interface error {
        messages: [{path:string,message:string}?]
    }

    const result: error = {
        messages: []
    }

    if (!body.user || body.user=="") {
        result.messages.push({
            path:"user",
            message:"inexistente o vacio"
        });
    }

    if (!body.articles || body.articles<0) {
        result.messages.push({
            path:"articles",
            message:"menor a cero o inexistente"
        });
    }
    

    if(result.messages.length > 0) {
        //console.log("Reject validation");
        return Promise.reject(result);
    }
    //console.log("Resolve validation");
    return Promise.resolve(body);
    
}

export function getRecommendations(){

    return new Promise<IRecommendation[]>((resolve,reject)=>{
        Recommendation.find({},(err,data)=>{
            if(err) return reject(err);
            resolve(data);
        });
    });

}