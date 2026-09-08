const { DataTypes } = require('sequelize');
const db = require('../../../config/database');

const RefreshToken = db.define('refresh_tokens', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
  },
  token: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  expiredAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expired_at',
  },
  revokedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    field: 'revoked_at',
  },
  revokedReason: {
    type: DataTypes.ENUM('logout', 'rotated', 'expired', 'security'),
    allowNull: true,
    defaultValue: null,
    field: 'revoked_reason',
  },
  replacedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    field: 'replaced_by',
  },
  deviceId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
    field: 'device_id',
  },
  deviceName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
    field: 'device_name',
  },
  deviceType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: null,
    field: 'device_type',
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    field: 'user_agent',
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    defaultValue: null,
    field: 'ip_address',
  },
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = RefreshToken;
