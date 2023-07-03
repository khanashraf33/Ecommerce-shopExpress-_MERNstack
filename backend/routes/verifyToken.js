const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) =>{
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err,user) =>{
            if(err) res.status(403).json("Token is not valis!");
            req.user = user;
            console.log(user);
            next();
        });
    }else {
        return res.status(401).json("you are not autenticate");
    } 
}

const verifyTokenAndAuthorization = (req, res, next) =>{
    verifyToken(req, res, ()=>{
        console.log(req.user.id);
        console.log(req.params.id);
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("you are not allow to do that!");
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) =>{
    verifyToken(req, res, ()=>{
        // console.log(req.user.id);
        // console.log(req.params.id);
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("you are not allow to do that!");
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };