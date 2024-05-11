import { MerchantCache } from "./../../utils/redis/merchant.cache";
import HTTP_STATUS from "http-status-codes";
import { IAuthDocument } from "./../../auth/interfaces/auth.interface";
import { config } from "./../../config";
import { Helpers } from "./../../shared/helpers/helpers";
import { merchantQueue } from "./../../shared/services/queues/merchant.queue";
import { BadRequestError } from "./../../shared/helpers/error-handler";
import { merchantService } from "./../services/merchant.service";
import {
  IMerchantDocument,
  IMerchantSignupData,
} from "./../interfaces/merchant.interface";
import { Request, Response } from "express";
import JWT from "jsonwebtoken";
import { ObjectId } from "mongodb";

const merchantCache: MerchantCache = new MerchantCache();

const createMerchant = async (req: Request, res: Response): Promise<void> => {
  const { fullname, username, email, phone, password } = req.body;
  const checkIfMerchantExists: IMerchantDocument =
    await merchantService.getMerchantByUsernameOrEmail(username, email);

  if (checkIfMerchantExists) {
    throw new BadRequestError("Invalid Credentials");
  }

  const merchantObjectId: ObjectId = new ObjectId();
  const mId = `${Helpers.generateRandomIntegers(12)}`;

  const merchantDataForAuth: IMerchantDocument = merchantSignupData({
    _id: merchantObjectId,
    mId,
    username,
    email,
    password,
    fullname,
    phone,
  });
  // add to redis cache
  const merchantDataForCache: IMerchantDocument = merchantData(
    merchantDataForAuth,
    merchantObjectId
  );
  await merchantCache.saveMerchantToCache(
    `${merchantObjectId}`,
    mId,
    merchantDataForCache
  );

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

const merchantSignupData = (data: IMerchantSignupData): IMerchantDocument => {
  const { _id, username, fullname, email, phone, mId, password } = data;
  return {
    _id,
    mId,
    username: Helpers.firstLetterUppercase(username),
    email: Helpers.lowerCase(email),
    fullname: fullname,
    phone: phone,
    password,
    createdAt: new Date(),
  } as IMerchantDocument;
};

function merchantData(
  data: IMerchantDocument,
  merchantObjectId: ObjectId
): IMerchantDocument {
  const { fullname, username, email, phone, password, mId } = data;
  return {
    _id: merchantObjectId,
    mId,
    username: Helpers.firstLetterUppercase(username!),
    email,
    fullname,
    phone,
    password,
  } as unknown as IMerchantDocument;
}

export { createMerchant };
