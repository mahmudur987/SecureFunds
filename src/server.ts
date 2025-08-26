/* eslint-disable no-console */
import mongoose from "mongoose";
import app from "./app";
import { envVariables } from "./app/config/env.config";
import { seedAdmin } from "./app/utils/seedSuperAdmin";
import { User } from "./app/modules/user/user.model";

const port = 5000;

const uri = envVariables.DB_URL;

const startServer = async () => {
  try {
    await mongoose.connect(uri);
    console.log("connected to mongodb");
  } catch (error) {
    console.error("Not connect  to Mongodb", error);
  }
};
(() => {
  seedAdmin();
  startServer();
})();
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected ...server shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.log("uncaught Exception detected ....server shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGTERM", () => {
  console.log("Sigterm single detected ....server shutting down");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("SIGINT single detected ....server shutting down");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// unhandled Rejection error
// Promise.reject(new Error("I forget to catch this error"));

// uncaughtException error
// throw new Error("I forget to handle local error");
