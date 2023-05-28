import { Router } from "express";
import "express-async-errors";
import { signIn, signUp } from "../controllers/auth";
import { signInValidator, signUpValidator } from "../validators/auth";

const authRouter = Router();

authRouter.post("/signup", signUpValidator, signUp);

authRouter.post("/signin", signInValidator, signIn);

export default authRouter;
