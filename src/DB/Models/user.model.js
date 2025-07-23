import mongoose from "mongoose";
// collection [in Data base app]= model [in folder structure]

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
  },
  {
    timestamps: true,
  }
);


const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;

