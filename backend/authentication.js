const {validateToken}= require("./services/authenticationJWT")

function checkForAuthenticationCookie(cookieName){
    return(req,res,next)=>{
        const tookenCookieValue = req.cookies[cookieName]
        if(!tookenCookieValue){
            return next()
        }

        try{
            const userPayload = validateToken(tookenCookieValue)
            req.user= userPayload
        }catch(error){
            return res.status(500).json({Error:"Cookie Value is Not Valid"})
        }
        return next()
    }
}

module.exports={
    checkForAuthenticationCookie
}