const jwt = require('jsonwebtoken');
require('dotenv').config();

const userProjectAuth = async (req, res, next) => {
    const cookies = await req.headers.cookie;
    if(cookies!=undefined){
        const isToken = cookies.toString().startsWith("token");
        if (isToken) {
            const token = cookies.toString().split("=")[1];
            const isvalidtoken=await jwt.verify(token,process.env.JWT_SECRET);
            if (!isvalidtoken) {
                res.redirect('/login');
            }
            next();
        }else{
            res.redirect('/login');
        }
    }else{
        res.redirect('/login');
    }
    
}


module.exports = userProjectAuth;