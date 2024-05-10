import { createMerchant } from "./../controllers/merchant.controller";
import express, { Router } from "express";
import { merchantSignupSchema } from "../schemas/merchant";
import { validateSchema } from "../../utils/validate";

class MerchantRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post(
      "/merchant/signup",
      validateSchema(merchantSignupSchema),
      createMerchant
    );

    return this.router;
  }
}

export const merchantRoutes: MerchantRoutes = new MerchantRoutes();
