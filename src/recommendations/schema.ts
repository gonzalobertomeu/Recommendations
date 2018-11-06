'use strict'

import { Schema, model, Document } from "mongoose";

export interface IRecommendation extends Document{
    user: String,
    articles: Number,
    setUser: Function,
    setArticle: Function
}

let recomSchema = new Schema({
    user: String,
    articles: Number
},{collection:"recommendations"});

recomSchema.methods.setUser = function (user:string) {
    this.user = user;
}

recomSchema.methods.setArticle = function (article:number) {
    this.articles = article;
}

export let Recommendation = model<IRecommendation>("Recommendation", recomSchema);