// Api Route
import express from "express";
const router = express.Router();

import { usersRouter } from "./modules/users";
import organizationRouter from "./modules/organizations";

// Route Handlers - all modules
router.use("/users", usersRouter);
router.use("/organizations", organizationRouter);

export { router };
