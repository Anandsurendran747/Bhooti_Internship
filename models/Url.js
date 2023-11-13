const mongoose = require("mongoose");
//creating new databse model for each user
const UrlSchema = new mongoose.Schema(
    {
       longURL:{
        type:String,
        require:true
       },
       shortURL:{
        type:String,
        require:true
       }
        
    },
    { timestamps: true }
);
//exporting model
module.exports = mongoose.model("url", UrlSchema);