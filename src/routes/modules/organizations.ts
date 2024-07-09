//routes to handle organizations

import express from 'express';
import { ServiceException } from '../../utils/types/exception';
import OrganizationController from '../../db/dal/Organization';

const organizationRouter = express.Router();

// organizationRouter.get('/', async (req, res) => {
//     try {
//         const organizations = await OrganizationController.findAll();
//         res.json(organizations);
//     } catch (error) {
//         throw new ServiceException("DBError", 400, (error as Error).message ? (error as Error).message : "Error when getting organizations");
//     }
// });

// organizationRouter.get('/:id', async (req, res) => {
//     try {
//         const organization = await OrganizationController.findByPk(req.params.id);
//         if (!organization) {
//             throw new ServiceException("DBError", 400, "organization not found");
//         }
//         res.json(organization);
//     } catch (error) {
//         throw new ServiceException("DBError", 400, (error as Error).message ? (error as Error).message : "Error when getting organization");
//     }
// });

organizationRouter.post('/', async (req, res) => {
    try {
        const organization = await OrganizationController.create(req.body);
        res.json(organization);
    } catch (error) {
        throw new ServiceException("DBError", 400, (error as Error).message ? (error as Error).message : "Error when creating organization");
    }
});

// organizationRouter.put('/:id', async (req, res) => {
//     try {
//         const organization = await OrganizationController.findByPk(req.params.id);
//         if (!organization) {
//             throw new ServiceException("DBError", 400, "organization not found");
//         }
//         await OrganizationController.update(req.body);
//         res.json(organization);
//     } catch (error) {
//         throw new ServiceException("DBError", 400, (error as Error).message ? (error as Error).message : "Error when updating organization");
//     }
// });

// organizationRouter.delete('/:id', async (req, res) => {
//     try {
//         const organization = await OrganizationController.findByPk(req.params.id);
//         if (!organization) {
//             throw new ServiceException("DBError", 400, "organization not found");
//         }
//         await OrganizationController.destroy();
//         res.json(organization);
//     } catch (error) {
//         throw new ServiceException("DBError", 400, (error as Error).message ? (error as Error).message : "Error when deleting organization");
//     }
// });

export default organizationRouter;