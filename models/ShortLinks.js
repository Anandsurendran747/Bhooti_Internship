const mongoose = require("mongoose");
//creating new databse model for each user
const ShortLinkSchema = new mongoose.Schema(
    {
        shorlink:{
            type:String,
            require:true
        }

    },
    { timestamps: true }
);
//exporting model
module.exports = mongoose.model("shortlink", ShortLinkSchema);