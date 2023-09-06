const role = require('../models/roleSchema');
const {Snowflake} = require('@theinternetfolks/snowflake');
const {roleV} = require('../helpers/validationSchema');


// Create Role
const createRole = async(req,res)=>{
    try {
        const joiValidate = await roleV.validateAsync(req.body);

        //process.exit(1);
    const data = new role({ 
        id : Snowflake.generate({ timestamp: Date.now() }),
        name : req.body.name,
    });
    //console.log(data);
    data.save()
        .then((result)=>{
            res.status(200).json({message:'Role created successfully',result});
        })
        .catch((err)=>{
            res.status(401).json({message:'Not inserted',err});
        })


    } catch (error) {
        if(error.isJoi === true){
            return res.status(422).json({status:false, validation:error.details[0] })
        }

        //console.log(error.details[0])
    }
      
};


//Get All created Role
const getRole = async (req,res)=>{

    const resultsPerPage = 10;
    let page = req.params.page >= 1 ? req.params.page : 1;
    page = page - 1;

    const count = await role.count();

    role.find({})
        .limit(resultsPerPage)
        .skip(resultsPerPage * page)
        .then((data)=>{ res.status(200).json({status:"true",content:{meta:{total:count,pages:Math.ceil(count / resultsPerPage), page: page+1}}, data})})
        .catch((err)=>{res.status(402).json({message:'something went wrong'})});
    
};

module.exports = {
    createRole,
    getRole
}