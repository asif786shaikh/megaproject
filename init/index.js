const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

main().then((data)=>{
    console.log("connect to database");
}).catch((err)=>{
    console.log(err);
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

};


const initDb = async()=>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'698b0c701d7eb0833f50755e'}));
    await listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDb();
