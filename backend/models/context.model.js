import { DataTypes } from "sequelize";
import { sequelize } from "../database/db.js";

export const Context = sequelize.define(
  "Context",
  {
    context_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    context_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    context_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    s3_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "contexts",
  }
);
