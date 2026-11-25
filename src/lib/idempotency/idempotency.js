import {cacheProvider} from "../cache/init.js";
import {json} from "express";

export function idempotency(ttl = 3600){
    return async (req , res , next)=>{
        const idempotency = req.headers['idempotency-key'];
        let key = `${req.method}:${req.originalUrl}:${idempotency}`;  // POST:/pay/4355688999887766543321
       const cached = await cacheProvider.get(key)
        if(cached){
            res.setHeader('X-cached' , 'HIT')
            return res.json(JSON.parse(cached))
        }
        const originalJson = res.json.bind(res)
        res.json = async (body)=>{
            if(res.statusCode >= 200 && res.statusCode < 300){
                await cacheProvider.set(key, JSON.stringify(body) , ttl )
                res.setHeader('X-Cached' , 'MISS')
            }
            return originalJson(body)
        }
        next()
    }
}