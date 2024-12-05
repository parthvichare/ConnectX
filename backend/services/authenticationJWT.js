const JWT= require("jsonwebtoken")

const secret = "$parth12"

//Generating Token when User first SignUp
function createTokenForUser(user){
    const payload={
        id:user._id,
        email:user.email,
        profileImageUrl: user.profileImageUrl
    }

    const token = JWT.sign(payload,secret)
    return token
}

//ValidToken when User SignIn
function validateToken(token){
    const payload = JWT.verify(token,secret);
    return payload
}

module.exports={
    createTokenForUser,
    validateToken
}