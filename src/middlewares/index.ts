import express from "express";
import jwt from "jsonwebtoken";
import { HTTP_STATUS_ERROR_CODES, JWT_SECRET_KEY } from "../utils/constants";
import logger from "../utils/logger";
import { AuthorizationException, BaseException } from "../utils/types/exception";
import { handleError } from "../utils/errorHandling";

export async function middlewareAuthorization(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  logger.info(
    `authorizeServiceTokenOrUserClaim: checking for either a service token or user claims`,
  );
  // check for a user claim. If so, it is ok to proceed.
  if (!req.headers["authorization"]) {
    const errorMsg = "No authorization header or user claim provided";
    logger.error(errorMsg);
    res.set("WWW-Authenticate", "Service Token=Authorization Required");
    return res.status(HTTP_STATUS_ERROR_CODES.NOT_ALLOWED).send({ message: errorMsg });
  }else{
    next();
  }

  if (req.headers["user-id"]) {
    next();
    return;
  }
};

export const authenticateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req?.headers?.authorization?.split(' ')[1];

    // Verify the token
    if(token){
      jwt.verify(token, JWT_SECRET_KEY,
        (err, decoded) => {
        if(err){
          throw new AuthorizationException('InvalidCredentials',"fails to verify token", err);
        }
        logger.info(decoded);
        next();
      });
    }else{
      throw new AuthorizationException("InvalidCredentials","token param is empty");
    }
  } catch (error) {

    logger.error('Error authenticating user:', error);
    const defaultError = {
      status: HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
      type: "InvalidCredentials",
      message: "Issue authenticating user",
      data: error
    }

    const baseException = new BaseException(
      defaultError.status,
      defaultError.type,
      defaultError.message,
      defaultError.data
    )
    handleError(baseException, res)
  }
};
