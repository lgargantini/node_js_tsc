// Api Route
import express from "express";
const router = express.Router();

import { middlewareAuthorization } from "../middlewares";
import { usersRouter } from "./modules/users";
import organizationRouter from "./modules/organizations";

// Route Handlers - all modules
router.use("/users", middlewareAuthorization, usersRouter);
router.use("/organizations", middlewareAuthorization, organizationRouter);

export { router };
