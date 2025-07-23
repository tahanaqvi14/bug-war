import mongoose from 'mongoose'

const userSchema=mongoose.Schema({
    displayname:{
        minlength:1,
        required:true,
        trim:true
    },
    username:{
        minlength:1,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        
        trim:true
        //Removes leading/trailing whitespace automatically before saving.
    },

})

const User = mongoose.model('User', userSchema);
export default User;


// module.exports = mongoose.model("user", userSchema);

// const userSchema = mongoose.Schema({
//     fullname: {
//         type: String,
//         minlength: 1,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     cart: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'product'
//         }
//     ],
//     orders: {
//         type: Array,
//         default: []
//     },
//     picture: {
//         type: String,
//         default: ''
//     }
// });
