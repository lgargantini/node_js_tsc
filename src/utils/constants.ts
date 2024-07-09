export const HEADER_USER_ID = 'user-id';

export const JWT_SECRET_KEY = 'secretKey';

//http error codes
export enum HTTP_STATUS_ERROR_CODES {
  OK = 200,
  CREATED = 201,
  UPDATED_SUCCESSFULLY = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  NOT_ALLOWED = 405,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
}

export const PASSWORD_REGEX = '^.{3,30}';
