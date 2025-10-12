const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js");


const mongo_url="mongodb://127.0.0.1:27017/Wanderlust";

async function main(){
    await mongoose.connect(mongo_url);
}

main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

const initDB=async ()=>{
     await listing.deleteMany({});
     initdata.data=initdata.data.map((obj)=>({...obj, owner:"67f37113b2354d051966686a"}));
  await  listing.insertMany(initdata.data);
  console.log("data was initialise "); 

}
initDB();

