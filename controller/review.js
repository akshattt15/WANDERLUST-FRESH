const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    let rating = req.body.review.rating;

    if (Array.isArray(rating)) {
        rating = rating[0];
    }

    rating = Number(rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).send("Invalid rating value. Must be between 1 and 5.");
    }

    req.body.review.rating = rating;

    // ✅ Create and set author properly
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("New review saved");
    req.flash("success", "New review created!!");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview=async(req,res)=>
    {
        let { id,reviewId }=req.params;
        await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","review deleted!!"); 
        res.redirect(`/listings/${id}`);
    };