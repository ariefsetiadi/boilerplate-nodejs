import { Sequelize } from "sequelize";
import db from "../../config/database.js";
import User from "./user.model.js";

const { DataTypes } = Sequelize;

const Token = db.define(
  "tokens",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    accessToken: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "access_token",
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "expires_at",
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      field: "created_at",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Token.belongsTo(User, { foreignKey: "userId" });

export default Token;

(async () => {
  await db.sync();
})();
