'use strict';

// Create Seeder      : npx sequelize-cli seed:generate --name create-users
// Seed All           : npx sequelize-cli db:seed:all
// Seed Specific      : npx sequelize-cli db:seed --seed seeder_name.js
// Rollback Last      : npx sequelize-cli db:seed:undo
// Rollback All       : npx sequelize-cli db:seed:undo:all
// Rollback Specific  : npx sequelize-cli db:seed:undo --seed seeder_name.js

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        full_name: 'Super Administrator',
        place_birth: 'Jakarta',
        date_birth: '1991-01-01',
        gender: '1',
        email: 'superadmin@email.com',
        password: await bcrypt.hash('Pass12345', 10),
        default_password: '1',
        status: '1',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        full_name: 'Administrator',
        place_birth: 'Batam',
        date_birth: '1992-02-02',
        gender: '0',
        email: 'admin@email.com',
        password: await bcrypt.hash('Pass12345', 10),
        default_password: '1',
        status: '1',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        full_name: 'General User',
        place_birth: 'Bekasi',
        date_birth: '1993-03-03',
        gender: '1',
        email: 'user@email.com',
        password: await bcrypt.hash('Pass12345', 10),
        default_password: '1',
        status: '1',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: [
          'superadmin@email.com',
          'admin@email.com',
          'user@email.com',
        ],
      },
    });
  },
};
