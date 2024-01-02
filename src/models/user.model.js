const DataTypes = require("sequelize");
const bcrypt = require("bcrypt");
const db = require("../../config/database");

const User = db.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    placeBirth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

User.beforeCreate(async (user, options) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

module.exports = User;

(async () => {
  await db.sync();
})();
