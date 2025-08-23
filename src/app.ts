import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import expressSession from "express-session";
// import "./config/passport";
import { globalErrorHandler } from "./app/middleware/globalError";
import { notFound } from "./app/middleware/notFound";
import { router } from "./app/routes/modules.route";
const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // frontend URLs
    credentials: true, // allow cookies, sessions, auth headers
  })
);

app.use(
  expressSession({
    secret: "your secrete",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express with TypeScript!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
