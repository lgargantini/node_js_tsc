
import { Op } from "sequelize";
import Token, { TokenInput, TokenOutput } from '../models/Token'
import { ServiceException } from "../../utils/types/exception";
import { HTTP_STATUS_CODES } from "../../utils/constants";
import { UUID } from "crypto";

export const getTokenByResetTokenInformation = async (reset_token: string, tokenExpiration: number): Promise<TokenOutput> => {
  const token = await Token.findOne({
    where: {
      [Op.and]: [
        {
          reset_token,
          reset_token_expiration: {
            [Op.gt]: tokenExpiration
          }
        }
      ]
    }
  })
  if (!token) {
    throw new ServiceException("DBError", HTTP_STATUS_CODES.NOT_FOUND, "token not found");
  }
  return token;
}

export const create = async (payload: TokenInput): Promise<TokenOutput> => {
  try {
    return await Token.create(payload)
  } catch (error) {
    throw new ServiceException("DBError", 400, (error as Error).message ? (error as Error).message : "Error when creating token");
  }
}

export const getById = async (id: number): Promise<TokenOutput> => {
  const token = await Token.findByPk(id)
  if (!token) {
    throw new ServiceException("DBError", HTTP_STATUS_CODES.NOT_FOUND, "token not found")
  }
  return token
}

export const getByUserId = async (uid: UUID): Promise<TokenOutput[]> => {
  const token = await Token.findAll({
    where: {
      user_id: uid
    }
  })
  if (!token) {
    throw new ServiceException("DBError", HTTP_STATUS_CODES.NOT_FOUND, "token not found")
  }
  return token
}

export const deleteById = async (id: number): Promise<boolean> => {
  await getById(id);
  try {
    const token = await Token.destroy({ where: { id } })
    return !!token
  } catch (error) {
    throw new ServiceException("DBError", HTTP_STATUS_CODES.BAD_REQUEST, "Error when deleting token");
  }
}

export const deleteByUserID = async (uid: UUID): Promise<boolean> => {
  await getByUserId(uid);
  try {
    const token = await Token.destroy({ where: { user_id: uid } })
    return !!token
  } catch (error) {
    throw new ServiceException("DBError", HTTP_STATUS_CODES.BAD_REQUEST, "Error when deleting token");
  }
}

export default {
  create,
  getTokenByResetTokenInformation,
  getByUserId,
  deleteById,
  deleteByUserID,
}
