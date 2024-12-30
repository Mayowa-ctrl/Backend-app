const express = require('express');
const { register, login, updateDetails, deleteUser, getUser, getUsers, updatePassword, forgotPassword, resetPassword } = require('../controller/auth');
const { reset } = require('nodemon');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/update/:id', updateDetails)
router.delete('/delete/:id', deleteUser)
router.get('/user/:id', getUser)
router.get('/users', getUsers)
router.put('/updatePassword/:id', updatePassword)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)


module.exports = router;