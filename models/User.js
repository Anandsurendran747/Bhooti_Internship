const mongoose = require("mongoose");
//creating new databse model for each user
const UserSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            require: true,
        },
        lname:{
            type: String,
            require: true
        },
        dob: {
            type: String,
            require: true
        },
        address: {
            type: String,
            require: true
        },
        pin: {
            type: Number,
            require: true
        },
        number: {
            type: Number,
            require: true
        }
        
    },
    { timestamps: true }
);
//exporting model
module.exports = mongoose.model("userData", UserSchema);