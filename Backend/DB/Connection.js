import mongoose from 'mongoose';

const connectDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        const schema= new mongoose.Schema({
            name:String,
            age:Number
        })
        const user=mongoose.model("owners",schema)

        // Get and print all users with name "taha"
        const result = await user.find({name: "taha"});
        console.log(result);


        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit on failure
    }
};

export default connectDB;
