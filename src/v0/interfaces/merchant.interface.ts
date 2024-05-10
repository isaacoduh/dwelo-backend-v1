import mongoose, { Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface IMerchantDocument extends Document {
  _id: string | ObjectId;
  fullname?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
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
