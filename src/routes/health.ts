// Health Route

import express from "express";
import { HTTP_STATUS_ERROR_CODES } from "../utils/constants";

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
router.get("/", (req, res) => res.status(HTTP_STATUS_ERROR_CODES.OK).send({ status: "UP"}));

export { router };
