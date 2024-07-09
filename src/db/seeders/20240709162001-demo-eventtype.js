'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.bulkInsert('EventType', [
    {
      name: 'Birthday',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Wedding',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Graduation',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Anniversary',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Corporate',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Other',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {});
}
export async function down(queryInterface) {
  await queryInterface.bulkDelete('EventType', null, {});
}
