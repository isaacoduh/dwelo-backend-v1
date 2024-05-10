import { IMerchantDocument } from "../interfaces/merchant.interface";
import mongoose, { model, Model, Schema } from "mongoose";

const merchantSchema: Schema = new Schema({
  fullname: { type: String },
  username: { type: String },
  email: { type: String },
  phone: { type: String },
  password: { type: String },
  passwordResetToken: { type: String, default: "" },
  passwordResetExpires: { type: Number },
});

const MerchantModel: Model<IMerchantDocument> = model<IMerchantDocument>(
  "Merchant",
  merchantSchema,
  "Merchant"
);
export { MerchantModel };
