import connectDB from "./DB/connection.js";
import noteRouter from "./Modules/Notes/note.controller.js";
import userRouter from "./Modules/users/user.controller.js";

const bootstrap=(app,express)=>{
app.use(express.json());

connectDB();
app.use("/users",userRouter)
app.use("/notes",noteRouter)




app.all("/*demo",(req,res,next)=>{
  return res.status(404).json({
    message: "Page is not found"
  })
})

}

export default bootstrap;