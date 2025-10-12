const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./review.js");

const listingSchema= new Schema({
title:{
    type:String,
    required:true,
},
description:String,
image:{
    filename: String,
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1645551519404-ffbef68bf4be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmVhdXRpZnVsJTIwcGxhY2VzfGVufDB8fDB8fHww"
    },
}, 
price:Number,
location:String,
country:String,
reviews:[
  {
    type:Schema.Types.ObjectId,
    ref:"Review"
  },
],
owner: {
  type: Schema.Types.ObjectId,
  ref: "User"
},
geometry: {
  type: {
    type: String, 
    enum: ["Point"], 
    required: true,
    default: "Point" 
  },
  coordinates: {
    type: [Number],
    required: true,
    default: [77.2090, 28.6139] // ✅ default coordinates (e.g., Delhi)
  }
}
});



listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
  await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});

const listing=mongoose.model("listing",listingSchema);
module.exports=listing;
