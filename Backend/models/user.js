import mongoose from 'mongoose'

const userSchema=mongoose.Schema({
    displayname:String,
    username:String,
    password:{
        type:String,
        required:true
    },

})

// module.exports = mongoose.model("user", userSchema);
const User = mongoose.model('User', userSchema);
export default User;



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
