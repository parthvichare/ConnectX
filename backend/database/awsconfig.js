const AWS =  require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
})

const elasticache = new AWS.ElastiCache()

const verifyAWSConfig=()=>{
    return new Promise((resolve,reject)=>{
        elasticache.describeCacheClusters({}, (err,data)=>{
            if(err){
                console.log("Error fetching Cache clusters:",err)
                reject(err)
            }else{
                console.log("AWS Cache configuration verified")
                resolve(data.CacheClusters)
            }
        })
    })
}

module.exports = {
    verifyAWSConfig
}