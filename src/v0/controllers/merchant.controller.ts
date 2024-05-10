import { Request, Response } from "express";
import { joiValidation } from "../../shared/decorators/joi-validation.decorators";
import { merchantSignupSchema } from "../schemas/merchant";

const createMerchant = async (req: Request, res: Response): Promise<void> => {
  const { fullname, username, email, phone, password } = req.body;
  console.log(fullname);
};

export { createMerchant };
