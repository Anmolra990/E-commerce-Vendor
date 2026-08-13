import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../src/modules/auth/auth.model.js";

dotenv.config();

const { MONGODB, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

const requiredValues = {
  MONGODB,
  ADMIN_NAME,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
};

const missingValues = Object.entries(requiredValues)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingValues.length) {
  console.error(`Missing required environment variables: ${missingValues.join(", ")}`);
  process.exit(1);
}

if (ADMIN_PASSWORD.length < 6) {
  console.error("ADMIN_PASSWORD must be at least 6 characters.");
  process.exit(1);
}

try {
  await mongoose.connect(MONGODB);

  const email = ADMIN_EMAIL.toLowerCase().trim();
  const password = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name: ADMIN_NAME.trim(),
        email,
        password,
        role: "admin",
        isFrozen: false,
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin user is ready: ${admin.email} (ID: ${admin._id})`);
} catch (error) {
  console.error("Unable to seed admin user:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
