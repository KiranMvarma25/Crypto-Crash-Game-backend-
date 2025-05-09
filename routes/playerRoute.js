const express = require('express');
const { createUsers, getUsers, getUsersById, updateUsers, deleteUsers } = require('../controllers/playerSignupController');
const { userLogin } = require('../controllers/playerLoginController');
const { Auth } = require('../middleware/auth');

const usersRouter = express.Router();

usersRouter.post('/createUsers', createUsers);
usersRouter.get('/getUsers', getUsers);
usersRouter.get('/getUsersById/:id', getUsersById);
usersRouter.put('/updateUsersById/:id', updateUsers);
usersRouter.delete('/deleteUsersById/:id', deleteUsers);

usersRouter.post('/userLogin', userLogin);
usersRouter.get('/userAuthentication', Auth, (req,resp) => {
    resp.status(200).json({
        success : true,
        message : "User Authenticated"
    })
})

module.exports = usersRouter;