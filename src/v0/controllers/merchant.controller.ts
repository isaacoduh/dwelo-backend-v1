import HTTP_STATUS from "http-status-codes";
import { IAuthDocument } from "./../../auth/interfaces/auth.interface";
import { config } from "./../../config";
import { Helpers } from "./../../shared/helpers/helpers";
import { merchantQueue } from "./../../shared/services/queues/merchant.queue";
import { BadRequestError } from "./../../shared/helpers/error-handler";
import { merchantService } from "./../services/merchant.service";
import { IMerchantDocument } from "./../interfaces/merchant.interface";
import { Request, Response } from "express";
import JWT from "jsonwebtoken";
import { ObjectId } from "mongodb";

const createMerchant = async (req: Request, res: Response): Promise<void> => {
  const { fullname, username, email, phone, password } = req.body;
  const checkIfMerchantExists: IMerchantDocument =
    await merchantService.getMerchantByUsernameOrEmail(username, email);

  if (checkIfMerchantExists) {
    throw new BadRequestError("Invalid Credentials");
  }

  const merchantObjectId: ObjectId = new ObjectId();

  // add to database
  merchantQueue.addMerchantJob("addMerchantToDB", {
    value: {
      fullname,
      username: Helpers.firstLetterUppercase(username),
      email: Helpers.lowerCase(email),
      phone,
      password,
    } as IMerchantDocument,
  });

  const merchantJWT: string = signToken(
    {
      _id: merchantObjectId,
      email: email,
      username: username,
    } as IMerchantDocument,
    merchantObjectId
  );

  // set current user
  //   req.currentUser = {user: merchantJWT};
  res.status(HTTP_STATUS.CREATED).json({
    message: "Merchant Account Created Successfully",
    merchant: { fullname, email, username },
    token: merchantJWT,
  });
};

const signToken = (
  data: IMerchantDocument,
  merchantObjectId: ObjectId
): string => {
  return JWT.sign(
    {
      userId: merchantObjectId,
      email: data.email,
      username: data.username,
      userType: "MERCHANT",
    },
    config.JWT_TOKEN!
  );
};

export { createMerchant };
