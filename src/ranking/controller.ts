'use strict'

import { Response, Request } from 'express';
import { IRanking, Ranking } from './schema';
import { isBuffer } from 'util';
import { Error } from 'mongoose';


export function HelloWorld(req: Request,res:Response) {
    res.status(200).send({
        message: "Ranking list"
    });
}

export async function scorePoint(body: IRanking): Promise<IRanking>{
    //no hace falta validar articulos, porque las peticiones por rabbit provienen de una validacion de catalog.
    try {

        const validated = await validateScore(body)
        const score = await isPreviouslyScored(validated);


        if (score.score == 0) {
            score.score = 1;
            let toSave = new Ranking({
                owner: score.owner,
                article: score.article,
                score: score.score
            });
            return new Promise<IRanking>((resolve,reject)=>{
                toSave.save((err,result)=>{
                    if (err) reject(err);
                    resolve(result);
                });
            });
        } else {
            score.score ++;
            return new Promise<IRanking>((resolve,reject)=>{
                score.save((err,result)=>{
                    if (err) reject(err);
                    resolve(result);
                });
            });
        }
        
        
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

function validateScore(body: IRanking) {
    interface Error {
        message: [{path:string, message:string}?]
    }

    const result: Error = {message:[]};

    if (!body.owner || body.owner == ""){
        result.message.push({
            message:"Sin usuario en la llamada",
            path:"owner"
        });
    }
    if (!body.article || body.article == ""){
        result.message.push({
            message:"Sin articulo en la llamada",
            path:"article"
        });
    }
    if(result.message.length > 0){
        return Promise.reject(result);
    }else{
        return Promise.resolve(body);
    }
}

function isPreviouslyScored(body: IRanking):Promise<IRanking>{
    const {owner, article, score} = body;
    
    return new Promise<IRanking>((resolve,reject)=>{
        Ranking.findOne({
            "owner": owner,
            "article": article
        }).exec((err,data)=>{
            if (err) reject(err);
            if (!data) {
                body.score = 0;
                resolve(body)
            }else {
                resolve(data);
            }
        });
    });
    
}

export interface IRequestRanking{
    owner: string,
    article: string
}

export function getScoredArticles(): Promise<String[]>{
    return new Promise((resolve,reject)=>{
        Ranking.find({}).distinct('article').exec((err,result)=>{
            if(err) reject(err);
            if(result.length == 0) reject({status:404,message:"Not found"});
            resolve(result as String[]);
        });
    });
}

export function getAll(): Promise<IRanking[]> {
    return new Promise((resolve,reject)=>{
        Ranking.find({}).exec((err,result)=>{
            if(err) reject(err);
            if(result.length == 0) reject({status:404,message:"Not found"});
            resolve(result as IRanking[]);
        });
    })
}


export interface topTen {
    article: String,
    score: number
}
export async function getTopTen():Promise<topTen[]> {
    try {
        console.log("Funcionando internamente");
        const scoredArticles: String[] = await getScoredArticles();
        const allArticles: IRanking[] = await getAll();

        let toReturn : topTen[] = [];
        scoredArticles.forEach((article)=>{
            let score = allArticles.filter(art => art.article === article)
                        .map(art => art.score)
                        .reduce((acc,scr)=> acc+scr,0);
            toReturn.push({
                article: article,
                score: score
            });
        });
        console.log(toReturn);

        return Promise.resolve(toReturn);
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

export function getUserRecommendation(userId: string, limit: number): Promise<IRanking[]>{
    return new Promise((resolve,reject)=>{
        Ranking.find({owner:userId}).limit(limit).exec((err,result)=>{
            if(err) reject(err);
            if(result.length == 0) reject({status:404,message:"User not found"});
            resolve(result);
        });
    });
}


export interface Error {
    message: string,
    status: number
}