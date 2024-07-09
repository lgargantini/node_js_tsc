import { Sequelize } from 'sequelize'

// Load environment variables

const dbName = process.env.DB_NAME as string
const dbUser = process.env.DB_USER as string
const dbHost = process.env.DB_HOST
const dbPassword = process.env.DB_PASSWORD

// Create a new Sequelize instance for the database connection
const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'postgres',
  port: 5432,
  schema: 'public'
});

export default sequelizeConnection
