// Api Route
import express from "express";
const router = express.Router();

import {usersRouter} from "./modules/users";
import { middlewareAuthorization } from "../middlewares";

// Route Handlers - all modules
router.use("/users", middlewareAuthorization, usersRouter);

export { router };
