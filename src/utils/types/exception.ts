/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { HTTP_STATUS_ERROR_CODES } from "../constants";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ServiceErrorType =
  | "DBError";

export type AuthenticationErrorType =
  | "InvalidCredentials"
  | "PasswordChangeRequired";

export type ValidationErrorType =
  | "EmailDoesntMatch"
  | "ValidationError";


export interface IBaseExceptionInput {
  name?: string,

}

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
}

export class ServiceException extends BaseException {
  constructor(
    type: ServiceErrorType,
    http_status: number,
    message: string,
    data?: any,
  ) {
    super(http_status, message, data, type);
    this.name = "ServiceException";
  }

  override toJSON():
  {
    status: number;
    type: string;
    name: string | undefined;
    message: string;
    data: any;

  } {

    if(this.name){
      this.message = `[${this.name}]`.concat(this.message)
    }
    if(this.type){
      this.message = `[${this.type}]`.concat(this.message)
    }
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
    super(HTTP_STATUS_ERROR_CODES.UNAUTHORIZED, message, data);
    this.name = "AuthorizationException";
    this.type = type;
  }

  override toJSON(): {
    status: number;
    type: string;
    name: string | undefined;
    message: string;
    data: any;
  } {
    if(this.name){
      this.message = `[${this.name}]`.concat(this.message)
    }
    if(this.type){
      this.message = `[${this.type}]`.concat(this.message)
    }

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
    super(http_status, message, data);
    this.name = "ValidationException";
    this.type = type;
  }

  override toJSON(): { status: number; type: string; name: string | undefined; message: string; data: any; } {
    if(this.name){
      this.message = `[${this.name}]`.concat(this.message)
    }
    if(this.type){
      this.message = `[${this.type}]`.concat(this.message)
    }

    return {
      status: this.http_status,
      type: this.type,
      name: this.name,
      message: this.message,
      data: this.data
    }
  }
}
