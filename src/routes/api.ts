// Api Route
import express from "express";
const router = express.Router();

// Import the route handlers
import {usersRouter} from "./modules/users";
import { middlewareAuthorization } from "../middlewares";



// Route Handlers for all the APIs
router.use("/users", middlewareAuthorization, usersRouter);

export { router };
