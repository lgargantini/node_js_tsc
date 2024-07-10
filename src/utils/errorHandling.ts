/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import logger from './logger';
import { BaseException } from './types/exception';
import { HTTP_STATUS_CODES } from './constants';

export function handleError(error: BaseException, res: express.Response): void {
  logger.error('Error:', error);
  try {
    res.status(error.http_status).json(error.toJSON());
  } catch (e) {
    // move this line!!
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(e);
  }
}
