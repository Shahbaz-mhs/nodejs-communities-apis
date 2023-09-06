const cummunity = require("../models/cummSchema");
const memeberSchema = require("../models/memeberSchema");
const { Snowflake } = require("@theinternetfolks/snowflake");
const jwt = require("jsonwebtoken");

const { communityV, memberV } = require('../helpers/validationSchema');

let jwtSecretKey = process.env.JWT_SECRET_KEY;


//create cummunity
const createCummunity = (req, res) => {
    const token = req.token;
  
    jwt.verify(token, jwtSecretKey, async (err, result) => {
      if (err) return res.status(400).json({ status: false });
  
      try {
        const communityV = await signupV.validateAsync(req.body);
      } catch (error) {
        if(error.isJoi === true){
          return res.status(422).json({status:false, validation:error.details[0] })
      }
      }
  
      // let findUser = await users.find({ id: result });
  
      const name = req.body.name;
  
      let cummData = new cummunity({
        id: Snowflake.generate({ timestamp: Date.now() }),
        name,
        owner: result.userID,
      });
  
      cummData
        .save()
        .then((data) => {
          data = data.toObject();
  
          delete data._id;
  
          delete data.__v;
  
          return res.status(200).json({ status: true, content: { data } });
        })
        .catch((err) => {
          return res.status(401).json({ err });
        });
    });
  };



  //Get All Creatd Cummunity
  const getAllCummunity = async (req, res) => {
    const token = req.token;
  
    jwt.verify(token, jwtSecretKey, async (err, result) => {
      if (err) return res.status(400).json({ status: false, message: err });
  
      const resultsPerPage = 10;
      let page = req.params.page >= 1 ? req.params.page : 1;
      page = page - 1;
  
      const count = await cummunity.count();
  
      pipeline = [
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "id",
            as: "owner",
          },
        },
        {
          $project: {
            _id: 0,
            "owner._id": 0,
            "owner.email": 0,
            "owner.password": 0,
            "owner.createdAt": 0,
            "owner.updatedAt": 0,
            "owner.__v": 0,
            __v: 0,
          },
        },
        { $skip: resultsPerPage * page },
        { $limit: resultsPerPage },
      ];
  
      cummunity.aggregate(pipeline).exec(function (err, data) {
        if (err) return res.status(404).json({ status: false, message: err });
  
        res
          .status(200)
          .json({
            status: "true",
            content: {
              meta: {
                total: count,
                pages: Math.ceil(count / resultsPerPage),
                page: page + 1,
              },
              data,
            },
          });
      });
  
      // cummunity.find({}).populate('owner')
      // .then((data)=>{res.status(200).json({data})})
      // .catch((err)=>{res.status(404).json({status:false, message:err})});
    });
  };


  //Add User to created Cummunity
  const addUsertoCummunity = async (req, res) => {
    const token = req.token;
  
    const { community, user, role } = req.body;
  
    jwt.verify(token, jwtSecretKey, async(err, result) => {
      if (err) return res.status(400).json({ status: false, message: err });
  
      try {
        const joiValidate = await memberV.validateAsync(req.body);
      } catch (error) {
        if(error.isJoi === true){
          return res.status(422).json({status:false, validation:error.details[0] })
      }
      }
  
      let member = new memeberSchema({
        id: Snowflake.generate({ timestamp: Date.now() }),
        community,
        user,
        role,
      });
  
      member
        .save()
        .then((data) => {
          data = data.toObject();
          delete data._id;
          delete data.__v;
          delete data.updatedAt;
  
          return res.status(200).json({ status: true, content: { data } });
        })
        .catch((err) => {
          return res.status(401).json({ err });
        });
    });
  };


  //Delete user from cummunity
const dltCummunityMember = (req, res) => {
    const token = req.token;
    const memberID = req.params.id;
    // console.log(memberID);
    // process.exit(1);
    //let findUser = await users.find({ id: result });
    jwt.verify(token, jwtSecretKey, async (err, result) => {
      let findUser = await memeberSchema.find({ id: memberID });
      // console.log(findUser);
      // process.exit(1);
      if (findUser == '')
        return res
          .status(404)
          .json({ status: false, message: "Member not Found!" });
      let cummunityData = await cummunity.find({ id: findUser[0].community });
      if (cummunityData[0].owner == result.userID) {
        memeberSchema
          .deleteOne({ id: memberID })
          .then(function () {
            res.status(200).json({ status: true }); //success
          })
          .catch(function (error) {
            res.status(401).json({ status: false, message: err }); // Failure
          });
      } else {
        res
          .status(401)
          .json({ status: false, message: "You are not the cummunity owner" }); // Failure
      }
      
    });
  };


  //Get All cummunity members
  const getAllCummunityMem = async (req, res)=>{
    const slug = req.params.id;
    //console.log(slug)
    //process.exit(1);
  
    const cummData = await cummunity.find({slug});
    if(cummData == '') return res.status(401).json({message:'Cummunity not found!'});
    const cummunityID = await cummData[0].id;
    // console.log(cummData[0].id)
    // process.exit(1);
  
    const resultsPerPage = 10;
      let page = req.params.page >= 1 ? req.params.page : 1;
      page = page - 1;
  
      const count = await memeberSchema.count();
  
      pipeline = [{
        $match: {
            'community': {
                $eq: cummunityID
            }
        }
    },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "roles",
            localField: "role",
            foreignField: "id",
            as: "role",
          },
        },
        {
          $project: {
            "_id":0,
            "id":1,
            "community":1,
            "user.id":1,
            "user.name":1,
            "role.id":1,
            "role.name":1,
            "createdAt":1
            
          },
        },
        { $skip: resultsPerPage * page },
        { $limit: resultsPerPage },
      ];
  
  
      memeberSchema.aggregate(pipeline).exec(function (err, data) {
        if (err) return res.status(404).json({ status: false, message: err });
  
        res
          .status(200)
          .json({
            status: "true",
            content: {
              meta: {
                total: count,
                pages: Math.ceil(count / resultsPerPage),
                page: page + 1,
              },
              data,
            },
          });
      });
  
  };


 //Get my owned Cummunity
  const getMyCummunity = async(req, res)=>{
    const token = req.token;
    jwt.verify(token, jwtSecretKey, async(err, result)=>{
      // console.log(result)
      // process.exit(1);
      if (err) return res.status(400).json({ status: false, message: err });
  
      const resultsPerPage = 10;
      let page = req.params.page >= 1 ? req.params.page : 1;
      page = page - 1;
  
      const count = await cummunity.count({owner:result.userID});
  
      pipeline = [
        {
          $match: {
              'owner': {
                  $eq: result.userID
              }
          }
      },
        {
          $project: {
            _id: 0,
            // "owner._id": 0,
            // "owner.email": 0,
            // "owner.password": 0,
            // "owner.createdAt": 0,
            // "owner.updatedAt": 0,
            // "owner.__v": 0,
            __v: 0,
          },
        },
        { $skip: resultsPerPage * page },
        { $limit: resultsPerPage },
      ];
  
      cummunity.aggregate(pipeline).exec(function (err, data) {
        if (err) return res.status(404).json({ status: false, message: err });
  
        res
          .status(200)
          .json({
            status: "true",
            content: {
              meta: {
                total: count,
                pages: Math.ceil(count / resultsPerPage),
                page: page + 1,
              },
              data,
            },
          });
      });
  
  
    })
  };


  //Get my joined cummunity
  const getMyjoinedCummunity = async(req, res)=>{
    const token = req.token;
    jwt.verify(token, jwtSecretKey, async(err, result)=>{
    //    console.log(result)
    //    process.exit(1);
      if (err) return res.status(400).json({ status: false, message: err });
  
      const resultsPerPage = 10;
      let page = req.params.page >= 1 ? req.params.page : 1;
      page = page - 1;
  
      const count = await memeberSchema.count({user:result.userID});
  
      pipeline = [
        {
          $lookup: {
            from: "cummunities",
            localField: "community",
            foreignField: "id",
            as: "mycummunity",
          },
        },
        
        {
          $lookup: {
            from: "users",
            localField: "mycummunity.owner",
            foreignField: "id",
            as: "owner2",
          },
        },
        // {
        //   $project: {
            
        //   }
        // },
        {
          $unwind : '$mycummunity' ,
        },
        {
          $unwind : '$owner2' ,
        },
        { $set: { "mycummunity.owner": {id:"$owner2.id",name:"$owner2.name"} } },
        {
          $match: {
              'user': {
                  $eq: result.userID
              }
          }
      },
        {
          $project: {
            
            _id: 0,
            "mycummunity._id": 1,
            "mycummunity.name": 1,
            "mycummunity.slug": 1,
             "mycummunity.owner": 1,
             "mycummunity.updatedAt": 1,
             "mycummunity.createdAt": 1,
          },
        },
        { $skip: resultsPerPage * page },
        { $limit: resultsPerPage },
      ];
  
      memeberSchema.aggregate(pipeline).exec(function (err, data) {
        if (err) return res.status(404).json({ status: false, message: err });
  
        res
          .status(200)
          .json({
            status: "true",
            content: {
              meta: {
                total: count,
                pages: Math.ceil(count / resultsPerPage),
                page: page + 1,
              },
              data,
            },
          });
      });
  
  
    })
  };

  module.exports = {
    createCummunity,
    getAllCummunity,
    addUsertoCummunity,
    dltCummunityMember,
    getAllCummunityMem,
    getMyCummunity,
    getMyjoinedCummunity,
  }