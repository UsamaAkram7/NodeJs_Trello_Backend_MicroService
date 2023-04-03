require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const userModal = require("../database/models/userModel");
const logger = require("../logger");

class UserController {
  constructor(req, res) {
    this.res = res;
    this.req = req;
  }
  async addUser() {
    logger.info(`-------------ADDING USER DETAILS TO DATABASE ------------`);

    const { req, res } = this;

    const { userName, userEmail, userPassword } = req.body;
    const encryptedPassword = await bcrypt.hash(userPassword, 15);
    try {
      let result = await userModal.findOne({ _id: userEmail });

      if (result) {
        res.status(400).send({ status: 400, error: "User Already Exists" });
      } else {
        let userObject = {
          _id: userEmail,
          userEmail: userEmail,
          userName: userName,
          userPassword: encryptedPassword,
        };
        const newUser = await new userModal(userObject);
        let savedUser = await newUser.save();
        if (savedUser) {
          res.send({ status: 200, msg: "User Created Successfully" });
          logger.info(`User Created Successfully.`);
        } else {
          logger.error(`Cannot create user`);
          res.status(400).send({ status: 400, error: "Cannot create user" });
        }
      }
    } catch (e) {
      logger.error(`Error while creating user ${e}`);
      res
        .status(400)
        .send({ status: false, error: "Error while creating user" });
    }
  }

  async validateUser() {
    logger.info(`-------------VALIDATING USER DETAILS ------------`);

    const { req, res } = this;
    const { email, password } = req.headers;

    try {
      let user = await userModal.findOne({ _id: email });
      if (user) {
        if (await bcrypt.compare(password, user.userPassword)) {
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "60min",
                }
              );
        
              // save user token
              user = {...user.toObject(), token};
        
              // user
              res.status(200).json(user);
        
        } else {
          res.status(400).send({ status: 400, error: "Wrong Password" });
        }
      } else {
        res.status(404).send({ status: 404, error: "User Not Found" });
      }
    } catch (e) {
        console.log(e)
      res
        .status(400)
        .send({ status: 400, error: "Error While Validating User" });
    }
  }
  async validateUserSession () {
    logger.info(`-------------VALIDATING USER DETAILS ------------`);
    const { req, res } = this;
    const token = req.headers["x_auth_token"];
  
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      req.user = decoded;
    } catch (err) {
        console.log(err);
      return res.status(401).send("Invalid Token");
    }
    return res.status(200).send("User Authenticated");
  };
}

module.exports = UserController;
