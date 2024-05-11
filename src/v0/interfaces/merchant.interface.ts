import mongoose, { Document } from "mongoose";
import { ObjectId } from "mongodb";

declare global {
  namespace Express {
    interface Request {
      currentMerchant?: MerchantAuthPayload;
    }
  }
}

export interface MerchantAuthPayload {
  merchantId: string;
  mId: string;
  email: string;
  username: string;
  iAt?: number;
}

export interface IMerchantDocument extends Document {
  _id: string | ObjectId;
  mId: string;
  fullname?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  createdAt?: Date;
}

export interface IMerchantSignupData {
  _id: string | ObjectId;
  mId: string;
  fullname?: string;
  email: string;
  username: string;
  phone: string;
  password: string;
}

export interface IMerchantJob {
  keyOne?: string;
  keyTwo?: string;
  key?: string;
  value?: string | IMerchantDocument;
}

export interface IEmailJob {
  receiverEmail: string;
  template: string;
  subject: string;
}

export interface IAllMerchants {
  merchants: IMerchantDocument[];
  totalMerchants: number;
}
