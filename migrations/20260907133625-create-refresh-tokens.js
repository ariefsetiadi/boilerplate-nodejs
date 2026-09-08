'use strict';

// Migrate DEV   : npx sequelize-cli db:migrate
// Rollback Last : npx sequelize-cli db:migrate:undo

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('refresh_tokens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      token: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      expired_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      revoked_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      revoked_reason: {
        type: Sequelize.ENUM('logout', 'rotated', 'expired', 'security'),
        allowNull: true,
        defaultValue: null,
      },
      replaced_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      device_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      device_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      device_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null,
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
        defaultValue: null,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('refresh_tokens');
  },
};
