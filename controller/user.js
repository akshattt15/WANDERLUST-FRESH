const passport = require("passport");
const User = require("../models/user");


module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=>
{
try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","welcome to wanderlust");
        res.redirect(res.locals.redirectUrl || "/listings");
    })
}
catch(e)
{
  req.flash("error",e.message);
  res.redirect("/signup");
}
};

module.exports.renderLoginForm=(req,res)=>{
  res.render("users/login.ejs");
};

module.exports.logout = (req,res)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  })
};

module.exports.login = (req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, () => {
    req.flash("success", "Welcome to Wanderlust again!!");
    res.redirect(res.locals.redirectUrl || "/listings");
  });
};