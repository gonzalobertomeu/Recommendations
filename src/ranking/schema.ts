'use strict'

import { Document, Schema, model } from "mongoose";

export interface IRanking extends Document{
    owner: string,
    article: string,
    score: number
}

let rankingSchema = new Schema({
    owner: String,
    article: String,
    score: Number
},{collection:"ranking"});

rankingSchema.index({owner:1,article:-1},{unique:true});

export let Ranking = model<IRanking>("Ranking",rankingSchema);