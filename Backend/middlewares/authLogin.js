const jwt = require('jsonwebtoken');
require('dotenv').config();
function isLoggedIn(req, res, next){
    const authCookie = req.cookies['authCookie'];
    if (!authCookie){
        return res.status(400).json({Access: false});
    }
    jwt.verify(authCookie, process.env.JWT_TOKEN, (err, user) => {
        if (err){
            return res.status(401).json({Access: false});
        }
        req.user = user;
        next();
    });
}
module.exports = isLoggedIn;