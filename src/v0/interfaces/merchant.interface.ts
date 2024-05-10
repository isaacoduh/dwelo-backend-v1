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
