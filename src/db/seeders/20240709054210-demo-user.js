'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
  */
  await queryInterface.bulkInsert('User', [{
    name: 'John Doe',
    email: 'test@newtest.com',
    password: 'password',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  }]);
}
export async function down(queryInterface) {
  await queryInterface.bulkDelete('User', null, {});
}
