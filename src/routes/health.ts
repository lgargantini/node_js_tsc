// Health Route

import express from "express";
import { HTTP_STATUS_CODES } from "../utils/constants";
// BE CAREFUL: initializerModel - flush the database
// import initializerModel from "../db/models";

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Health Check
 *     description: Returns true if the server is up
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns true if the server is up
 */
router.get("/", (req, res) => res.status(HTTP_STATUS_CODES.OK).send({ status: "UP" }));




// uncomment the following code to enable the purge endpoint - flush the database
// router.purge("/_sync/", async (req, res) => {
//     // Add logic to check if the server is syncing data
//     await initializerModel();
//     res.status(HTTP_STATUS_CODES.OK).send({ status: "SYNC" })
// });

export { router };
