import crypto from "crypto";
export function correlationid(req, res , next){
    const id = crypto.randomUUID()
    req.correlationid = id
    res.setHeader("X-Correlation-Id", id)
    next()
}