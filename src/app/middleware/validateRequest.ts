import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await zodSchema.parseAsync(
        JSON.parse(req.body.data) || req.body
      );
      next();
    } catch (error) {
      next(error);
    }
  };
