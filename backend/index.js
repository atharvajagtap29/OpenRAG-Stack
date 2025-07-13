import debugLib from "debug";
import { app } from "./app.js";
import { TestConnection, sequelize } from "./database/db.js";

const debug = debugLib("server");
const port = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await TestConnection(); // Connect to DB first

    const server = app.listen(port, () => {
      console.log(`⚙️ Server is running at port: ${port}`);
    });

    process.on("SIGTERM", () => {
      debug("SIGTERM received. Shutting down server...");
      server.close(async () => {
        debug("HTTP server closed.");
        await sequelize.close();
        debug("DB connection closed.");
      });
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
