const playersSchema = require('../model/player');
const bcrypt = require('bcrypt');

exports.createUsers = async (req,resp) => {
    try{
        const { name, password, email } = req.body;

        if(!name || !password || !email ){
            return resp.status(400).json({
                success : false,
                message : "Please Fill All the Details"
            })
        }

        const isPresent = await playersSchema.findOne({email});
        if(isPresent){
            return resp.status(400).json({
                success : false,
                message : "Account already Exists, Please SignIn"
            })
        }

        let hashPassword;
        try{
            hashPassword = await bcrypt.hash(password, 10);
        }
        catch(error){
            return resp.status(400).json({
                success : false,
                message : "Error in Hashing the Password"
            })
        }

        const createdUser = await playersSchema.create({ name, password : hashPassword, email });
        
        return resp.status(200).json({
            success : true,
            message : "User Created Successfully",
            User : createdUser,
        });

    }
    catch(error){
        resp.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}

exports.getUsers = async(req,resp) => {
    try{
        const getusers = await playersSchema.find({});
        return resp.status(200).json({
            success : true,
            message : "User Fetched Successfully",
            User : getusers,
        });
    }

    catch(error){
        resp.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}

exports.getUsersById = async(req,resp) => {
    try{
        const { id } = req.params;

        try{
            const getuserbyid = await playersSchema.findById({_id : id})

            return resp.status(200).json({
                success : true,
                message : "User Fetched By Id Successfully",
                User : getuserbyid,
            });
        }

        catch(error){
            resp.status(500).json({
                success : false,
                message : `User with Id : ${id} Not Found`
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

exports.updateUsers = async(req,resp) => {
    try{
        const { id } = req.params;
        const { name, password, email } = req.body;

        const updatedUsers = await playersSchema.findByIdAndUpdate({_id : id}, { name, password, email });
        
        return resp.status(200).json({
            success : true,
            message : "Updated User Successfully",
            User : updatedUsers,
        });
    }

    catch(error){
        resp.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}

exports.deleteUsers = async(req,resp) => {
    try{
        const { id } = req.params;

        const deleteusers = await playersSchema.findByIdAndDelete({_id : id});
        
        return resp.status(200).json({
            success : true,
            message : "Deleted User Successfully",
            User : deleteusers,
        });
    }

    catch(error){
        resp.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}