const listing = require("../models/listing.js");


module.exports.index =async(req,res)=>{
    let allListings =await listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};


module.exports.showListing = async(req,res)=>{
    const data = await listing
        .findById(req.params.id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    res.render("listings/show.ejs",{data});
};


module.exports.createListing = async(req,res,next)=>{

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename}; 
    await newListing.save();

    req.flash("success","new listing created");
    res.redirect("/listing");
};


module.exports.renderEditForm = async(req,res)=>{
    let { id} = req.params;
    let data= await listing.findById(id);
    if(!data){
        req.flash("error","listing you requested for does not exist");
        return res.redirect("/listing");
    }
    let originalImageUrl = data.image.url;
    originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{data,originalImageUrl});
};

module.exports.updateListing = async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data");
    }
    let {id} =req.params;
    let lst =await listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file!=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    lst.image ={url,filename};
    await lst.save();
    }
    req.flash("success","listing is updated");
    res.redirect(`/listing/${id}`);

};


module.exports.destroyListing = async(req,res)=>{
    let {id} =req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","listing is deleted");
    res.redirect("/listing");

};