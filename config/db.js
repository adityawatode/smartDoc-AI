import mongoose from "mongoose"

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error("ERROR: MONGO_URI is not defined in .env");
        process.exit(1);
    }

    try {
        mongoose.set("strictQuery", false);
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`ERROR: ${error.message}`);
        if (error.name === "MongoServerSelectionError") {
            console.error(
                "MongoDB connection failed. Confirm your Atlas cluster allows your current IP address, or add 0.0.0.0/0 for development."
            );
        }
        process.exit(1);
    }
}

export default connectDB;