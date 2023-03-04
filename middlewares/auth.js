const jwt = require('jsonwebtoken');

exports.middleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        console.log('Access denied. No token provided');
        next();
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
        }
        req.user = decoded;
        next();
    });
}