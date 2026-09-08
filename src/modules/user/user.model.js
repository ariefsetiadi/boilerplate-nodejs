const DataTypes = require('sequelize');
const db = require('../../../config/database');
const bcrypt = require('bcryptjs');

const User = db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field: 'full_name',
  },
  placeBirth: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'place_birth',
  },
  dateBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'date_birth',
  },
  gender: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    isEmail: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  defaultPassword: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
    field: 'default_password',
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

User.beforeCreate(async (user, options) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

module.exports = User;
