'use strict'

import * as amqp from 'amqplib';
import { IRabbitMessage,RabbitProcessor } from "./common";

import { Config, getConfig } from "../utils/configs";


export class RabbitDirectConsumer {
    config: Config;

    constructor(private queue: string, private exchange:string){
        console.log(`Creando consumer para cola ${queue} y exchange ${exchange}`);
        this.config = getConfig(process.env)
    }


    processors = new Map<string,Function>();

    addProcessor(type:string,processor:Function){
        this.processors.set(type,processor);
    }

    async init() {
        try{

            const conn = await amqp.connect(`amqp://${this.config.rabbit}`);
            const channel = await conn.createChannel();

            channel.on("close",function(self:RabbitDirectConsumer){
                console.error(`RabbitMQ ${self.exchange}: Conexion cerrada, intentando reconectar en 10s`);
                setTimeout(()=>{
                    self.init();
                },10000);
            });

            console.log(`RabbitMQ ${this.exchange} conectado`);

            const exchange = await channel.assertExchange(this.exchange,"direct",{durable:false});
            const queue = await channel.assertQueue(this.queue,{durable:false});

            channel.bindQueue(queue.queue,exchange.exchange,exchange.exchange);
            channel.consume(queue.queue, (message)=>{
                if(message){
                    const rabbitmensaje: IRabbitMessage = JSON.parse(message.content.toString());
                    const id:any = message.properties.headers.id;
                    console.log(id);
                    if(this.processors.has(rabbitmensaje.type)){
                        const handler = this.processors.get(rabbitmensaje.type);
                        if(handler && id) {
                            handler(rabbitmensaje,id);
                        }   
                    }
                }
            },{noAck:true});

        }catch (err){
            console.error(`RabbitMQ ${this.exchange} ${err.message}`);
            setTimeout(()=> this.init(),10000)
        }
    }
}