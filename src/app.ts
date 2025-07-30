import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import passport from "passport";
import expressSession from "express-session";
// import "./config/passport";
import { globalErrorHandler } from "./app/middleware/globalError";
import { notFound } from "./app/middleware/notFound";
import { router } from "./app/routes/modules.route";
const app = express();

// middleware
app.use(
  expressSession({
    secret: "your secrete",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express with TypeScript!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
