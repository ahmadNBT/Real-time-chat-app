import mongoose from "mongoose";

const connectDB = async (mongoURI: string) => {

    const url = mongoURI

    if(!url) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }

  try {
    await mongoose.connect(url, {
        dbName: "chatapp-microservice"
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};


export default connectDB;