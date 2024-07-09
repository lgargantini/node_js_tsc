import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { UUID } from "crypto";
import sequelizeConnection from "../config";
import User, { IRole } from "./User";
import Organization from "./Organization";

export enum EventTypeTypes {
    MEETING = 'MEETING',
    INTERVIEW = 'INTERVIEW',
    APPOINTMENT = 'APPOINTMENT',
    EVENT = 'EVENT',
    WORKSHOP = 'WORKSHOP',
    COURSE = 'COURSE',
    WEBINAR = 'WEBINAR',
    DEMO = 'DEMO',
    CONSULTATION = 'CONSULTATION',
    OTHER = 'OTHER',
}

export enum EventTypeLocationType {
    "InPerson" = "InPerson",
    "Virtual" = "Virtual",
    "Phone" = "Phone",
    "Video" = "Video"
}

interface EventTypeAttributes {
    id: number;
    uuid?: UUID;
    slug: string;
    name: string;
    color: string;
    public: boolean;
    invitees_limit: number;
    type: EventTypeTypes;
    locale: string;
    uri: string;
    description: string;
    duration: number;
    duration_minutes: number;
    active: boolean;
    booking_url: string;
    location_type: EventTypeLocationType;
    location_type_count: number;
    owner_id: UUID;
    owner_type: string;
}


export interface EventTypeInput extends Optional<EventTypeAttributes, "id"> { }
export interface EventTypeOutput extends Required<EventTypeAttributes> { }

export class EventType extends Model<EventTypeAttributes, EventTypeInput> implements EventTypeAttributes {
    declare id: number;
    declare uuid: UUID;
    declare slug: string;
    declare name: string;
    declare color: string;
    declare public: boolean;
    declare invitees_limit: number;
    declare type: EventTypeTypes;
    declare locale: string;
    declare uri: string;
    declare description: string;
    declare duration: number;
    declare duration_minutes: number;
    declare active: boolean;
    declare booking_url: string;
    declare location_type: EventTypeLocationType;
    declare location_type_count: number;
    declare owner_id: UUID;
    declare owner_type: string;

}

EventType.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    color: {
        type: DataTypes.STRING,
    },
    public: {
        type: DataTypes.BOOLEAN,
    },
    invitees_limit: {
        type: DataTypes.INTEGER,
    },
    type: {
        type: DataTypes.ENUM,
        values: ['MEETING', 'INTERVIEW', 'APPOINTMENT', 'EVENT', 'WORKSHOP', 'COURSE', 'WEBINAR', 'DEMO', 'CONSULTATION', 'OTHER'],
    },
    locale: {
        type: DataTypes.STRING,
    },
    uri: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    booking_url: {
        type: DataTypes.STRING,
    },
    location_type: {
        type: DataTypes.ENUM,
        values: ['InPerson', 'Virtual', 'Phone', 'Video'],
    },
    location_type_count: {
        type: DataTypes.INTEGER,
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
}, {
    sequelize: sequelizeConnection,
    paranoid: true,
    timestamps: true,
    tableName: 'EventType',
});

User.hasMany(EventType, {
    foreignKey: 'owner_id',
    scope: {
        owner_type: 'user'
    },
    constraints: false
})
EventType.belongsTo(User, { foreignKey: 'owner_id', constraints: false })

Organization.hasMany(EventType, {
    foreignKey: 'owner_id',
    scope: {
        owner_type: 'organization'
    },
    constraints: false
});
EventType.belongsTo(Organization, {
    foreignKey: 'owner_id',
    constraints: false
});

//testing the model
(async () => {
    // BE CAREFUL WITH FORCE TRUE, IT WILL DROP THE TABLE
    await sequelizeConnection.sync({ force: true });
    const user = await User.create({
        name: 'John Doe',
        email: 'test@test.com',
        password: 'password',
        role: IRole.USER
    });
    await user.createEventType({
        slug: 'slug',
        name: 'name',
        color: 'color',
        public: true,
        invitees_limit: 10,
        type: EventTypeTypes.MEETING,
        locale: 'locale',
        uri: 'uri',
        description: 'description',
        duration: 10,
        duration_minutes: 10,
        active: true,
        booking_url: 'booking_url',
        location_type: EventTypeLocationType.InPerson,
        location_type_count: 10,
        owner_type: 'user',
        owner_id: user.id
    });
    const events = await user.getEventTypes();
    console.log('user events', events);
})();

export default EventType

