'use strict'

import * as amqp from 'amqplib';

export class RabbitDirectConsumer {

    constructor(private queue: string, private exchange:string){
        console.log(`Creando consumer para cola ${queue} y exchange ${exchange}`);
    }
    processors = new Map<string,Function>();

    addProcessor(type:string,processor:Function){
        this.processors.set(type,processor);
    }

    async init() {
        try{

            const conn = await amqp.connect("amqp://rmq");
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

            channel.bindQueue(queue.queue,exchange.exchange,queue.queue);
            channel.consume(queue.queue, (message)=>{
                if(message){
                    const rabbitmensaje: IRabbitMessage = JSON.parse(message.content.toString());
                    if(this.processors.has(rabbitmensaje.type)){
                        const handler = this.processors.get(rabbitmensaje.type);
                        if(handler) {
                            handler(rabbitmensaje);
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

export interface IRabbitMessage {
    type:string;
    exchange?:string;
    queue?:string;
    message:any;
}

export interface RabbitProcessor {
    (source: IRabbitMessage): void;
}