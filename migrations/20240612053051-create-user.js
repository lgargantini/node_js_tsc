'use strict';
/** @type {import('sequelize').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM,
        values: ['USER', 'ADMIN']
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('User');
  }
};
