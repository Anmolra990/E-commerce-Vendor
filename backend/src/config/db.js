import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB)
    console.log(" MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:", error);
  }
};

export default connectMongoDB;