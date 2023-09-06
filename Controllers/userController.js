const users = require("../models/userSchema");
const { Snowflake } = require("@theinternetfolks/snowflake");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
require("dotenv").config();
const { signupV, signinV } = require("../helpers/validationSchema");

let jwtSecretKey = process.env.JWT_SECRET_KEY;

//Create Account
const signup = async (req, res) => {
  try {
    const joiValidate = await signupV.validateAsync(req.body);
  } catch (error) {
    if (error.isJoi === true) {
      return res
        .status(422)
        .json({ status: false, validation: error.details[0] });
    }
  }

  const { name, email, password } = req.body;
  //hashPassword = bcrypt.hash(password, saltRounds);
  bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      let userData = new users({
        id: Snowflake.generate({ timestamp: Date.now() }),
        name,
        email,
        password: hash,
      });

      userData
        .save()
        .then((data) => {
          data = data.toObject();
          delete data.password;
          delete data._id;
          delete data.updatedAt;
          delete data.__v;

          userId = data.id;

          //token expiers in 5 minutes
          const access_token = jwt.sign({ userId }, jwtSecretKey, {
            expiresIn: "10m",
          });

          res.status(200).json({
            status: true,
            content: { data, meta: { access_token } },
          });
        })
        .catch((err) => {
          res.status(401).json({ message: "user not created", err });
        });
    })
    .catch((err) => {
      res.send(err);
    });
};

//Login route
const signin = async (req, res) => {
  try {
    const joiValidate = await signinV.validateAsync(req.body);

    const { email, password } = req.body;
    let findUser = await users.find({ email });
    findUser = findUser[0];
    userID = findUser.id;
    //console.log(findUser.password);
    //process.exit(1);

    bcrypt
      .compare(password, findUser.password)
      .then((result) => {
        //token expiers in 5 minutes
        const access_token = jwt.sign({ userID }, jwtSecretKey, {
          expiresIn: "10m",
        });

        findUser = findUser.toObject();
        delete findUser.password;
        delete findUser._id;
        delete findUser.updatedAt;
        delete findUser.__v;

        res.status(200).json({
          status: true,
          content: { data: findUser, meta: { access_token } },
        });
      })
      .catch((err) => {
        res.status(401).json({ status: false, message: "Signin Failed" });
      });
  } catch (error) {
    if (error.isJoi === true) {
      return res
        .status(422)
        .json({ status: false, validation: error.details[0] });
    }
  }
};

//Get my profile info
const me = async (req, res) => {
  //console.log(req.headers.authorization);
  const token = req.token;

  jwt.verify(token, jwtSecretKey, async (err, result) => {
    if (err) res.status(400).json({ status: false, message: err });
    //console.log(result);
    //process.exit(1);
    let findUser = await users.find({ id: result.userID });
    findUser = findUser[0];

    if (findUser == "")
      return res.status(401).json({ status: false, message: "not found" });

    findUser = findUser.toObject();
    delete findUser.password;
    delete findUser._id;
    delete findUser.updatedAt;
    delete findUser.__v;
    res.status(200).json({ status: true, content: { data: findUser } });
  });
};

module.exports = {
  signup,
  signin,
  me,
};
