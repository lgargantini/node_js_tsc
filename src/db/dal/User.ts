import User, { IRole, UserInput, UserOuput } from '../models/User'
import { ServiceException, ValidationException } from '../../utils/types/exception';
import { HTTP_STATUS_ERROR_CODES } from '../../utils/constants';

export const create = async (payload: UserInput): Promise<UserOuput> => {
    try{
        return await User.create({role: IRole.USER, ...payload})
    }catch(error){
        throw new ServiceException("DBError", 400, (error as Error).message ? (error as Error).message : "Error when creating user");
    }
}

export const update = async (id: string, payload: Partial<UserInput>): Promise<UserOuput> => {
    const user = await getById(id)
    return await (user as User).update(payload)
}

export const getById = async (id: string): Promise<UserOuput> => {
    try{
        const user = await User.findByPk(id)
        if (!user) {
            throw new ValidationException("ValidationError",HTTP_STATUS_ERROR_CODES.NOT_FOUND,"user not found")
        }
        return user
    }catch(error){
        throw new ServiceException("DBError", HTTP_STATUS_ERROR_CODES.BAD_REQUEST,"error fetching by id", error)
    }
}

export const getByEmail = async (email: string): Promise<UserOuput | null> => {
    return await User.findOne({where: {'email': email}})
}


export const deleteById = async (id: string): Promise<boolean|Error> => {
    await getById(id)
    const deletedUserCount = await User.destroy({
        where: {id}
    })
    return !!deletedUserCount
}

export const getAll = async (): Promise<UserOuput[]|Error> => {
    try{
        const users = User.findAll()
        return users;
    }catch(e){
        throw new ServiceException("DBError",HTTP_STATUS_ERROR_CODES.NOT_FOUND,'Issue listing users');
    }
}



export default {
    create,
    getAll,
    getById,
    getByEmail,
    update,
    deleteById,
}

