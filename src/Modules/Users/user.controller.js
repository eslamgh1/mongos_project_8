import { Router } from "express";
import * as userServices from "./user.service.js"

const userRouter = Router();


userRouter.post("/signup",userServices.signUpService)
userRouter.post("/login",userServices.loginService)
userRouter.patch("/update",userServices.updateUser)
userRouter.delete("/delete",userServices.deleteUser)
userRouter.get("/get",userServices.getUser)


export default userRouter;