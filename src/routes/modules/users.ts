'use strict';
//all users role routes
import express from "express";
import logger from "../../utils/logger";

import { Request, Response } from "express";
import TokenController from "../../db/dal/Token";
import UserController from "../../db/dal/User";
import { IRole, UserInput, UserOuput } from "../../db/models/User";
import { generateBcryptSafePassword, generateJWTToken, generateResetTokenInfo, ResetTokenInfo, validateBcryptPassword } from "../../utils";
import { HEADER_USER_ID, HTTP_STATUS_ERROR_CODES } from "../../utils/constants";
import { resetTokenSchema, userEmail, userSchema } from "../../db/validators";
import { AuthorizationException, BaseException, ValidationException } from "../../utils/types/exception";
import { handleError } from "../../utils/errorHandling";

export const authorizeUser = (requiredRole: IRole) => async (
  req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(!req.headers[HEADER_USER_ID]){
      throw new AuthorizationException("InvalidCredentials", "User id must be provided")
    }
  try {
    const user = await UserController.getById(String(req.headers[HEADER_USER_ID]));
    if (requiredRole !== (user as UserOuput).role && (user as UserOuput).role !== IRole.ADMIN) {
      throw new AuthorizationException("InvalidCredentials", "Invalid credentials", user)
    }
    next();
  } catch (error) {
    logger.error('Error authorizing user:', error);

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

const usersRouter = express.Router();

// Get all users
usersRouter.get("/", authorizeUser(IRole.ADMIN), async (req: Request, res: Response): Promise<void> => {
  try{
    const users = await UserController.getAll();
    res.status(HTTP_STATUS_ERROR_CODES.OK).send(users);
  }catch(error){
    logger.error(error);
    const defaultError = {
      status: HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
      type: "DBError",
      message: "get user: ",
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
});

// Get user by id //ADMIN ONLY
usersRouter.get("/:id", authorizeUser(IRole.ADMIN), async (req: Request, res: Response): Promise<void> => {
  try{
  const user = await UserController.getById(req.params.id);
  res.status(HTTP_STATUS_ERROR_CODES.OK).send(user);
  }catch(error){
    logger.error(error);
    const defaultError = {
      status: HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
      type: "Unhandled Error",
      message: "get user by id: ",
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
});

// Create user // ADMIN ONLY
usersRouter.post("/", authorizeUser(IRole.ADMIN) , async (req: Request, res: Response): Promise<void> => {
  try{
    const isValid = userSchema.validate(req.body);
    if (isValid.error) {
      throw new ValidationException(
        "ValidationError",
        HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
        "user validation failed",
        isValid.error
      );
    }
    const userBody: UserInput = {
      ...req.body,
      password: await generateBcryptSafePassword(req.body.password),
    }

    const user = await UserController.create(userBody);
    res.status(HTTP_STATUS_ERROR_CODES.CREATED).send((user as UserOuput));
  }catch(error){
    logger.error(error);
    const defaultError = {
      status: HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
      type: "Unhandled Error",
      message: "post user: ",
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
});

usersRouter.post("/register", async(req: Request, res: Response): Promise<void> => {
  try {
    const isValid = userSchema.validate(req.body);
    if (isValid.error) {
      throw new ValidationException(
        "ValidationError",
        HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
        "error validation: check your body",
        isValid.error
      );
    }
    const { email, password } = req.body;
    // Check if the email is already registered
    const duplicateEmail = await UserController.getByEmail(email);
    if (duplicateEmail) {
      throw new ValidationException(
        "ValidationError",
        HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
        "user validation failed: user exists"
      );
    }
    // Create a new user
    const user = await UserController.create({...req.body, password: generateBcryptSafePassword(password)});
    res.status(HTTP_STATUS_ERROR_CODES.CREATED).json(user);
    } catch (error) {
      logger.error('Error registering user:', error);
      const defaultError = {
        status: HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
        type: "DBError",
        message: "register user: ",
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
});

usersRouter.post("/login", async(req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if(!email && !password){
      throw new ValidationException(
        "ValidationError",
        HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
        "invalid body"
      );
    }
    // Check if the user exists
    const user = await UserController.getByEmail(email);
    // Validate the password
    const isPasswordValid = await validateBcryptPassword(password, user.password);
    if (!isPasswordValid) {
      throw new ValidationException(
        "ValidationError",
        HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
        'Invalid email or password',
        isPasswordValid
      );
    }
    // Generate a JWT token
    const token = generateJWTToken((user as UserOuput).id);

    res.status(HTTP_STATUS_ERROR_CODES.OK).json({ token });
  } catch (error) {
    logger.error('Error logging in:', error);
    const defaultError = {
      status: HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
      type: "Unhandled Error",
      message: "login user: ",
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
});

usersRouter.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const isValid = userEmail.validate(email)
    if(isValid.error){
      throw new ValidationException(
        "ValidationError",
        HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
        "Invalid params",
        isValid.error
      );
    }
    // Check if the user exists
    const user = await UserController.getByEmail(email);
    // Generate a reset token
    const resetToken: ResetTokenInfo = generateResetTokenInfo()
    const tokenPayload = {
      reset_token: resetToken.resetToken,
      reset_token_expiration: resetToken.resetTokenExpiration, // Token expires in 1 hour
      user_id: (user as UserOuput).id
    }
    await TokenController.create(tokenPayload)

    res.status(HTTP_STATUS_ERROR_CODES.OK).json({ message: 'Password reset token sent' });

  } catch (error) {
    logger.error('Error generating reset token:', error);
    const defaultError = {
      status: HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
      type: "Unhandled Error",
      message: "get user: ",
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
});

// Reset password using the reset token
usersRouter.post('/reset-password', async (req, res) => {
  try {
    const { reset_token, password } = req.body;
    const isValid = resetTokenSchema.validate(req.body)
    if(isValid.error){
      throw new ValidationException(
        "ValidationError",
        HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
        "Invalid params",
        isValid.error
      );;
    }
    // Find the user with the provided reset token
    const token = await TokenController.getTokenByResetTokenInformation(
      reset_token,
      Date.now(),
    );
    if (!token) {
      throw new ValidationException(
        "ValidationError",
        HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
        'Invalid or expired reset token'
      );
    }
    const user: UserOuput = await UserController.getById(token.user_id);
    // Update the user's password and reset token fields
    user.password = await generateBcryptSafePassword(password);
    await UserController.update(user.id, user);
    await TokenController.deleteById(token.id);

    res.status(HTTP_STATUS_ERROR_CODES.OK).json({ message: 'Password reset successful' });
  } catch (error) {
    logger.error('Error resetting password:', error);
    const defaultError = {
      status: HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
      type: "Unhandled Error",
      message: "reset user: ",
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
});

// Update user
usersRouter.put("/:id", authorizeUser(IRole.ADMIN), async (req: Request, res: Response): Promise<void> => {
  try{
    const newUser: UserInput = {...req.body, password: await generateBcryptSafePassword(req.body.password)}
    await UserController.update(req.params.id, newUser);
    res.status(HTTP_STATUS_ERROR_CODES.UPDATED_SUCCESSFULLY).send();
  }catch(error){
    logger.error("Error updating user", error);
    const defaultError = {
      status: HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
      type: "Unhandled Error",
      message: "put user: ",
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
});

// Delete user
usersRouter.delete("/:id", authorizeUser(IRole.ADMIN), async (req: Request, res: Response): Promise<void> => {
  try{
    await UserController.deleteById(req.params.id);
    res.status(HTTP_STATUS_ERROR_CODES.UPDATED_SUCCESSFULLY).send();
  }catch(error){
    logger.error("Error deleting user", error);
    const defaultError = {
      status: HTTP_STATUS_ERROR_CODES.BAD_REQUEST,
      type: "Unhandled Error",
      message: "delete user: ",
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
});

export { usersRouter };
