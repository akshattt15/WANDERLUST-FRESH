const express=require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controller/user.js");

router.get("/signup",userController.renderSignupForm);

router.post("/signup",wrapAsync(userController.signup));

router.get("/login",userController.renderLoginForm);

router.get("/logout",userController.logout);

router.post("/login",saveRedirectUrl,userController.login); 

module.exports=router;

