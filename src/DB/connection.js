import mongoose from 'mongoose';

const connectDB = async()=>{
  await mongoose.connect('mongodb://127.0.0.1:27017/NoteApp')
  .then(()=>{
console.log("DB is connected successfully")
  })
  .catch((error=>{
console.log("Faild to connect DB")
  }))
}


export default connectDB;