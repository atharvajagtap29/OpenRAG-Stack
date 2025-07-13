import "../config/config.js";
import { Sequelize } from "sequelize";

// Database connection setup
export const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT,
  logging: false,
});

const SyncDatabase = async () => {
  const sync = false;
  try {
    if (sync) {
      await sequelize.sync({ alter: sync });
      console.log("Database Synced Successfully ✅");
    }
  } catch (error) {
    console.error(`❌ ERROR in SyncDatabase() function: ${error.message}`);
  }
};

export const TestConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "✅ Connection to the database has been established successfully."
    );
    SyncDatabase();
  } catch (error) {
    console.error(`❌ ERROR IN TestConnection() function ${error}`);
  }
};
