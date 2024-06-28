/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { HTTP_STATUS_ERROR_CODES } from "../constants";

export enum errorName {
  ServiceException = "ServiceException",
  AuthenticationException = "AuthenticationException",
  ValidationException = "ValidationException",
  GeneralException = "GeneralException"
} 

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ServiceErrorType =
  | "DBError";

export type AuthenticationErrorType =
  | "InvalidCredentials"
  | "PasswordChangeRequired";

export type ValidationErrorType =
  | "EmailDoesntMatch"
  | "ValidationError";

export type GeneralErrorType = 
| "UnhandledError"
| "InternalServerError";

export class BaseException {
  name?: string;
  http_status: number;
  message: string;
  data: any;
  type: string;

  constructor(http_status: number, type: string, message: string, data?: any) {
    this.http_status = http_status;
    this.type = type;
    this.message = message;
    if (data) {
      this.data = data;
    }
    this.name = errorName.GeneralException
  }

  public toJSON() {
    return {
      status: this.http_status,
      type: this.type,
      name: this.name,
      message: this.message,
      data: this.data,
    }
  }

  public captureError(error: any): BaseException {
    try{
      this.http_status = error.http_status;
      this.type = error.type;
      this.name = error.name;
      this.message = error.message;
      this.data = error.data;
      return this
    }catch(e){
      throw new BaseException(HTTP_STATUS_ERROR_CODES.INTERNAL_SERVER_ERROR, "InternalServerError", "error when parsing", error);
    }
  }
}

export class ServiceException extends BaseException {
  constructor(
    type: ServiceErrorType,
    http_status: number,
    message: string,
    data?: any,
  ) {
    super(http_status, type, message, data);
    this.name = errorName.ServiceException;
  }

  override toJSON():
  {
    status: number;
    type: string;
    name: string | undefined;
    message: string;
    data: any;

  } {

      return {
        status: this.http_status,
        message: this.message,
        data: this.data,
        name: this.name,
        type: this.type,
      };
  }

}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export class AuthorizationException extends BaseException {

  constructor(type: AuthenticationErrorType, message: string, data?: any) {
    super(HTTP_STATUS_ERROR_CODES.UNAUTHORIZED, type, message, data);
    this.name = errorName.AuthenticationException;
  }

  override toJSON(): {
    status: number;
    type: string;
    name: string | undefined;
    message: string;
    data: any;
  } {
    return {
      status: this.http_status,
      type: this.type,
      name: this.name,
      message: this.message,
      data: this.data
    }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export class ValidationException extends BaseException {
  constructor(
    type: ValidationErrorType,
    http_status: number,
    message: string,
    data?: any,
  ) {
    super(http_status, type, message, data);
    this.name = errorName.ValidationException;
  }

  override toJSON(): { status: number; type: string; name: string | undefined; message: string; data: any; } {
    return {
      status: this.http_status,
      type: this.type,
      name: this.name,
      message: this.message,
      data: this.data
    }
  }
}
