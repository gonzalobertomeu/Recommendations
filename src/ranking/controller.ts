'use strict'

import { Response, Request } from 'express';
import { IRanking, Ranking } from './schema';


export function HelloWorld(req: Request,res:Response) {
    res.status(200).send({
        message: "Ranking list"
    });
}

export async function scorePoint(body: IRanking): Promise<IRanking>{
    //no hace falta validar articulos, porque las peticiones por rabbit provienen de una validacion de catalog.
    try {

        const score = await isPreviouslyScored(body);

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
            if(!result) reject("No data");
            resolve(result as String[]);
        });
    });
}

export function getAll(): Promise<IRanking[]> {
    return new Promise((resolve,reject)=>{
        Ranking.find({}).exec((err,result)=>{
            if(err) reject(err);
            if(!result) reject("No data");
            resolve(result as IRanking[]);
        });
    })
}

export async function getTopTen():Promise<any> {
    try {
        console.log("Funcionando internamente");
        const scoredArticles: String[] = await getScoredArticles();
        const allArticles: IRanking[] = await getAll();

        let toReturn : { article: String, score: number }[] = [];
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