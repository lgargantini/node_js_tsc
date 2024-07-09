import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import sequelizeConnection from '../config';
import { UUID } from 'crypto';
import EventType, { EventTypeInput } from './EventType';
import Membership, { MembershipInput } from './Membership';

export enum IRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

interface UserAttributes {
  id: UUID;
  name: string;
  email: string;
  password: string;
  role?: IRole;

}
export interface UserInput extends Optional<UserAttributes, "id"> { }
export interface UserOuput extends Required<UserAttributes> { }

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  declare id: UUID
  declare name: string
  declare email: string
  declare password: string
  declare role: IRole

  createEventType!: (eventType: EventTypeInput) => Promise<EventType>;
  updateEventType!: (eventType: EventTypeInput) => Promise<EventType>;
  getEventTypes!: () => Promise<EventType[]>;
  removeEventType!: (eventType: EventType) => Promise<void>;

  createMembership!: (membership: MembershipInput) => Promise<Membership>;
  updateMembership!: (membership: MembershipInput) => Promise<Membership>;
  getMemberships!: () => Promise<Membership[]>;
  removeMembership!: (membership: Membership) => Promise<void>;
}

User.init({
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: Sequelize.literal('uuid_generate_v4()'),
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM,
    values: ['USER', 'ADMIN']
  }
}, {
  sequelize: sequelizeConnection,
  paranoid: true,
  timestamps: true,
  tableName: 'User',
})

export default User
