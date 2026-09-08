'use strict';

// Create Migration : npx sequelize-cli migration:generate --name create-users
// Migrate DEV      : npx sequelize-cli db:migrate
// Migrate PROD     : npx sequelize-cli db:migrate --production
// Rollback Last    : npx sequelize-cli db:migrate:undo
// Rollback All     : npx sequelize-cli db:migrate:undo:all

const query = require('express/lib/middleware/query');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      full_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      place_birth: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      date_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        isEmail: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      default_password: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('users');
  }
};
