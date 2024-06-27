import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import sequelizeConnection from '../config';
import { UUID } from 'crypto';

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
export interface UserInput extends Optional<UserAttributes, "id"> {}
export interface UserOuput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  declare id: UUID
  declare name: string
  declare email: string
  declare password: string
  declare role: IRole
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
  paranoid: false,
  timestamps: false,
  tableName: 'User'
})

export default User
