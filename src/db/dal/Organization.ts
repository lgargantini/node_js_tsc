// when creating an organization, we need to provide a valid id from Membership

import { ServiceException } from "../../utils/types/exception";
import Organization, { OrganizationInput, OrganizationOutput } from "../models/Organization";

export const create = async (payload: OrganizationInput): Promise<OrganizationOutput> => {
    try{
        return await Organization.create(payload)
    }catch(error){
        throw new ServiceException("DBError", 400, (error as Error).message ? (error as Error).message : "Error when creating Organization");
    }
}

export default {
    create
}