//An Organization may have many Memberships, one per user, using their id as owner id

import { UUID } from "crypto";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import sequelizeConnection from "../config";
import EventType, { EventTypeInput } from "./EventType";
import Membership, { MembershipInput } from "./Membership";

interface OrganizationAttributes {
    id: UUID;
    name: string;
    description: string;
    active: boolean;
}

export interface OrganizationInput extends Optional<OrganizationAttributes, "id"> { }
export interface OrganizationOutput extends Required<OrganizationAttributes> { }

class Organization extends Model<OrganizationAttributes, OrganizationInput> implements OrganizationAttributes {
    declare id: UUID;
    declare name: string;
    declare description: string;
    declare active: boolean;

    createEventType!: (eventType: EventTypeInput) => Promise<void>;
    updateEventType!: (eventType: EventTypeInput) => Promise<void>;
    getEventTypes!: () => Promise<EventType[]>;
    removeEventType!: (eventType: EventType) => Promise<void>;

    createMembership!: (membership: MembershipInput) => Promise<void>;
    updateMembership!: (membership: MembershipInput) => Promise<void>;
    getMemberships!: () => Promise<Membership[]>;
    removeMembership!: (membership: Membership) => Promise<void>;
}

Organization.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize: sequelizeConnection,
    paranoid: true,
    timestamps: true,
    tableName: 'Organization',
});

export default Organization;