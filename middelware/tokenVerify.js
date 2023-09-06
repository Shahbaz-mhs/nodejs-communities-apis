const tokenVerify = (req, res, next)=>{
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
        let token = req.headers.authorization.split(' ')[1];
        req.token = token;
        next();

        // jwt.verify(token, jwtSecretKey, async(err, result)=>{
        //     if(err) res.status(400).json({status:false});

            
        //     //let findUser = await users.find({id: result});
        //     //findUser = findUser[0];
        //     //res.status(200).json({findUser});

            
        // });

    }else{
        res.status(404).json({status:flase, message:'token not found'});
    }
};

module.exports = tokenVerify;