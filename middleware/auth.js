const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.Auth = (req,resp,next) => {
    try{
        const token = req.cookies.Token;

        if(!token || token == undefined){
            return resp.status(401).json({
                success : false,
                message : "Token is Missing"
            })
        }

        try{
            const payload = jwt.verify(token, process.env.Secret_Key);
            req.user = payload;
        }

        catch(error){
            resp.status(500).json({
                success : false,
                message : "Token Mismatch"
            })
        }
        next();

    }
    catch(error){
        resp.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}