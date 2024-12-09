import mongoose from 'mongoose';

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connected")
    }catch (error) {
        console.log('error occurred: ' + error)
    }
}

export default connectDB;