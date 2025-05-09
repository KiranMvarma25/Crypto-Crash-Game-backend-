const playersSchema = require('../model/player');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.userLogin = async (req,resp) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return resp.status(400).json({
                success : false,
                message : "Please Fill All the Details"
            })
        }

        let user = await playersSchema.findOne({email});
        if(!user){
            return resp.status(400).json({
                success : false,
                message : "User Account not Found"
            })
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if(isPasswordMatched){

            const payload = {
                id : user._id,
                name : user.name,
                email : user.email,
                balance : user.balance
            }

            const options = {
                httpOnly : true,
                expires : new Date(Date.now() + 1 * 24 * 60 * 60 * 10000),
            }

            const token = jwt.sign(payload, process.env.Secret_Key);
            resp.cookie("Token", token, options).status(200).json({
                success : true,
                message : "Log In Successfully",
                Token : token,
                User : user,
            })
        }
        else{
            return resp.status(400).json({
                success : false,
                message : "Incorrect Password"
            })
        }

    }
    catch(error){
        resp.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}