import Redis from 'ioredis'

const redis = new Redis({
    host:"127.0.0.1",
    port:6379,
    maxRetriesPerRequest:null
})

redis.on("connect",()=>{
    console.log("Redis connected")
})

redis.on("error",(error)=>{
    console.log("Redis Error :",error.message)
})

export default redis

