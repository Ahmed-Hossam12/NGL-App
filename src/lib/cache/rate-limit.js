import {cacheProvider} from "./init.js";

export function cacheRateLimit(ttl = 180) {
    return async (req , res , next)=>{
        // request
        // method + URL
        // "GET:/products" : "[{},{},{},...]"
        let key = `${req.originalUrl}:${req.user.id}`
        const cashed = await cacheProvider.get(key)
        if(cashed){
            res.setHeader('X-Cache', 'HIT')
            return res.json(JSON.parse(cashed))
        }
        // interceptor
        // res.json >> send client response
        // res.json >> cache + send client response
        // get deep copy from implementation res.json before modify
        const originalJson = res.json.bind(res)
        res.json = async (body)=>{
            if(res.statusCode >= 200 && res.statusCode < 300){
                // 1. cache body
                await cacheProvider.set(key , JSON.stringify(body) , ttl)
                // 2. send response
                res.setHeader('X-Cache', 'MISS')
            }
            return originalJson(body)
        }
        next()
    }

}