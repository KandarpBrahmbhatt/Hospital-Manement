import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
    windowMs:15*60*1000 ,
    max:100,
    message:"Too many login Attepmt ,try later"
})

export const apiLimiter = rateLimit({
    windowMs:60*1000, // 1 min  
    max:5,
    message:"Too many request try later after 1 min"
})