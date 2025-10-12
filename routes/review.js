const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review=require("../models/review.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewcontroller=require("../controller/review.js");


router.post("/", isLoggedIn,reviewcontroller.createReview);

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,reviewcontroller.destroyReview);


module.exports=router;