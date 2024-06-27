
import { Op } from "sequelize";
import Token, {TokenInput, TokenOutput} from '../models/Token'
import { ServiceException } from "../../utils/types/exception";
import { HTTP_STATUS_ERROR_CODES } from "../../utils/constants";

export const getTokenByResetTokenInformation = async (reset_token: string, tokenExpiration: number): Promise<TokenOutput> => {
  const token = await Token.findOne({
      where: {
          [Op.and]: [
              { reset_token,
              reset_token_expiration: {
                  [Op.gt]: tokenExpiration
              }
              }
          ]
      }
  })
  if (!token){
      throw new ServiceException("DBError", HTTP_STATUS_ERROR_CODES.NOT_FOUND, "token not found");
  }
  return token;
}

export const create = async (payload: TokenInput): Promise<TokenOutput> => {
  try{
    return await Token.create(payload)
  }catch(error){
    throw new ServiceException("DBError", 400, (error as Error).message ? (error as Error).message : "Error when creating token");
  }
}

export const getById = async (id: number): Promise<TokenOutput> => {
  const token = await Token.findByPk(id)
  if (!token) {
      throw new ServiceException("DBError",HTTP_STATUS_ERROR_CODES.NOT_FOUND,"token not found")
  }
  return token
}

export const deleteById = async (id: number): Promise<boolean> => {
  await getById(id);
  try{
    const token = await Token.destroy({where: {id}})
    return !!token
  }catch(error){
    throw new ServiceException("DBError", HTTP_STATUS_ERROR_CODES.BAD_REQUEST, "Error when deleting token");
  }
}

export default {
  create,
  getTokenByResetTokenInformation,
  deleteById,
}
