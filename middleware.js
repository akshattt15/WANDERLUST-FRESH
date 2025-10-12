const Review = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
if(!req.isAuthenticated())
 {      
       req.session.redirectUrl=req.originalUrl; 
        req.flash("error","you must be logged in to create listing!!");
        return res.redirect("/login");
 }
    next(); 
};

module.exports.isReviewAuthor = async (req, res, next) => {
       const { id, reviewId } = req.params;
   
       const review = await Review.findById(reviewId).populate("author");
   
       if (!review) {
           req.flash("error", "Review not found!");
           return res.redirect(`/listings/${id}`);
       }
   
       if (!review.author || !review.author._id || !review.author._id.equals(req.user._id)) {
           req.flash("error", "You are not the author of this review");
           return res.redirect(`/listings/${id}`);
       }
   
       next();
   };

module.exports.saveRedirectUrl=(req,res,next)=>{
       if(req.session.redirectUrl)
       {
              res.locals.redirectUrl=req.session.redirectUrl;
       }
       next(); 
};