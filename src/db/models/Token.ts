import { DataTypes, Model, Optional, Sequelize } from "sequelize"
import sequelizeConnection from "../config";
import { UUID } from "crypto";
import User from "./User";

interface TokenAttributes{
  id: number;
  user_id: UUID;
  reset_token: string;
  reset_token_expiration: number;
}

// export interface TokenInput
export interface TokenInput extends Optional<TokenAttributes, 'id'>{}
export interface TokenOutput extends Required<TokenAttributes>{}

class Token extends Model<TokenAttributes, TokenInput> implements TokenAttributes {
  declare id: number;
  declare user_id: UUID;
  declare reset_token: string;
  declare reset_token_expiration: number;
}

Token.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.literal('uuid_generate_v4()'),
  },
  reset_token: {
    type: DataTypes.STRING
  },
  reset_token_expiration: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize: sequelizeConnection,
  paranoid: false,
  timestamps: false,
  tableName: 'Token'
});

Token.belongsTo(User, {foreignKey: 'user_id'});

// (async () => {
//   await sequelizeConnection.sync();
//   // Code here
// })();

export default Token;


