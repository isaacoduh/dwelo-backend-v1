import { IMerchantDocument } from "../interfaces/merchant.interface";
import mongoose, { model, Model, Schema } from "mongoose";
import { hash, compare } from "bcryptjs";

const merchantSchema: Schema = new Schema(
  {
    fullname: { type: String },
    username: { type: String },
    email: { type: String },
    phone: { type: String },
    password: { type: String },
    createdAt: { type: Date, default: Date.now },
    passwordResetToken: { type: String, default: "" },
    passwordResetExpires: { type: Number },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

merchantSchema.pre(
  "save",
  async function (this: IMerchantDocument, next: () => void) {
    const hashedPassword: string = await hash(this.password as string, 10);
    this.password = hashedPassword;
    next();
  }
);

merchantSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  const hashedPassword: string = (this as unknown as IMerchantDocument)
    .password!;
  return compare(password, hashedPassword);
};

merchantSchema.methods.hashPassword = async function (
  password: string
): Promise<string> {
  return hash(password, 10);
};

const MerchantModel: Model<IMerchantDocument> = model<IMerchantDocument>(
  "Merchant",
  merchantSchema,
  "Merchant"
);
export { MerchantModel };
