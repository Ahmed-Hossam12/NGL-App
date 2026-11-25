import {logger} from "../../pkg/logger/logger.js";

export function globalErrorHandler(err, req, res , next){
    logger.error(err.message , {
        stack: err.stack,
        correlationid: req.correlationid,
    })
    if(err.isOperational === true){
        return  res.status(err.statusCode).json(
            {
                error: err.message ,
                success:false ,
            });
    }
    return res.status(500).json({
        error: 'Something went wrong',
        success: false,
    })
}