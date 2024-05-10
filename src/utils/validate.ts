import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";

const validateSchema = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details });
    }
    next();
  };
};

export { validateSchema };
