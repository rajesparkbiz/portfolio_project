const jwt = require('jsonwebtoken');
const { use } = require('../config/email_config');


const userAuth = async (req, res, next) => {
    const token = await req.cookies['token'];
    
    if (!token) {
        res.redirect('/login');
    }   
    next();

}


module.exports = userAuth;