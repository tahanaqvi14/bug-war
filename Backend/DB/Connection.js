

// const connectDB = async () => {

//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI);

//         const schema= new mongoose.Schema({
//             name:String,
//             age:Number
//         })
//         const user=mongoose.model("owners",schema)

//         // Get and print all users with name "taha"
//         const result = await user.find({name: "taha"});
//         console.log(result);


//         console.log(`MongoDB connected: ${conn.connection.host}`);
//     } catch (err) {
//         console.error('MongoDB connection error:', err.message);
//         process.exit(1); // Exit on failure
//     }
// };

// export default connectDB;



import mongoose from 'mongoose';
import express from "express";
const app = express();
app.use(express.json());

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // //connection to a specific database in a cluster in mongodb atlas
        // const usersDB = mongoose.connection.useDb('Game');

        // // Explicitly tell Mongoose to use the 'Users' collection
        // DisplayName = usersDB.model('DisplayName', displayUsers, 'Users');

        console.log("✅ MongoDB Connected Successfully");

    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    }
};


export default connectToDatabase;
