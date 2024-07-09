'use strict';
/** @type {import('sequelize').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Token', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      reset_token: {
        type: Sequelize.STRING
      },
      reset_token_expiration: {
        type: Sequelize.INTEGER
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Token');
  }
};
