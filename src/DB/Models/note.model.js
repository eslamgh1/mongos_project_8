import mongoose from "mongoose";
// collection [in Data base app]= model [in folder structure]

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      lowercase:true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },

  },
  {
    timestamps: true,
  }
);


const noteModel = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default noteModel;
