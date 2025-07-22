const mongoose=require('mongoose');

const ownerSchema=mongoose.Schema({
    fullname:{
        type:String,
        minlength:3,
        required:true,
        trim:true
    },
    email:String,
    password:String,
    products:{
        type:Array,
        default:[]
    },
    picture:String,
    gstin:String,

});
 
module.exports=mongoose.model("owner",ownerSchema);