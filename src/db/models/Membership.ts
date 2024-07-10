import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import sequelizeConnection from '../config';
import { UUID } from 'crypto';
import User from './User';
import Organization from './Organization';

export enum MembershipOwnerTypes {
    user = 'user',
    organization = 'organization',
}

interface MembershipAttributes {
    id: number;
    owner_id: UUID;
    owner_type: string;
    avatar_url: string;
    avatar_letter: string;
    name: string;
    enabled?: boolean;
}

export interface MembershipInput extends Optional<MembershipAttributes, 'id'> { }
export interface MembershipOutput extends Required<MembershipAttributes> { }

class Membership
    extends Model<MembershipAttributes, MembershipInput>
    implements MembershipAttributes {
    declare id: number;
    declare owner_id: UUID;
    declare owner_type: string;
    declare avatar_url: string;
    declare avatar_letter: string;
    declare name: string;
    declare enabled?: boolean;
}

Membership.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        owner_id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
            allowNull: true,
        },
        owner_type: {
            type: DataTypes.ENUM,
            values: ['user', 'organization'],
            allowNull: true,
        },
        avatar_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatar_letter: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    },
    {
        sequelize: sequelizeConnection,
        paranoid: true,
        timestamps: true,
        tableName: 'Membership',
    }
);

User.hasMany(Membership, {
    foreignKey: 'owner_id',
    scope: {
        owner_type: 'user',
    },
    as: 'memberships',
    constraints: false,
});
Membership.belongsTo(User, { foreignKey: 'owner_id', constraints: false });

Organization.hasMany(Membership, {
    foreignKey: 'owner_id',
    scope: {
        owner_type: 'organization',
    },
    as: 'memberships',
    constraints: false,
});
Membership.belongsTo(Organization, {
    foreignKey: 'owner_id',
    constraints: false,
});

export default Membership;
