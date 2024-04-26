const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    emailID:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    token:{
        type:String,
    },
    expirationTime:{
        type:Date,
    },
    portfolio:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Stock'
    }],
    watchList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Stock'
    }],
    walletBalance:{
        type:Number,
        default:1000
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    transactions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Transaction'
    }]
});

module.exports=mongoose.model("User",userSchema);