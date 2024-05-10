import { IAuthDocument } from "./../../auth/interfaces/auth.interface";
import { Helpers } from "./../../shared/helpers/helpers";
import { IMerchantDocument } from "../interfaces/merchant.interface";
import { MerchantModel } from "../models/merchant.model";

class MerchantService {
  public async createMerchant(data: IMerchantDocument): Promise<void> {
    await MerchantModel.create(data);
  }

  public async getMerchantByUsernameOrEmail(
    username: string,
    email: string
  ): Promise<IMerchantDocument> {
    const query = {
      $or: [
        { username: Helpers.firstLetterUppercase(username) },
        { email: Helpers.lowerCase(email) },
      ],
    };
    const merchant: IMerchantDocument = (await MerchantModel.findOne(
      query
    ).exec()) as IMerchantDocument;
    return merchant;
  }

  public async getAuthMerchantByUsername(
    username: string
  ): Promise<IMerchantDocument> {
    const merchant: IMerchantDocument = (await MerchantModel.findOne({
      username: Helpers.firstLetterUppercase(username),
    }).exec()) as IMerchantDocument;
    return merchant;
  }

  public async getAuthMerchantByEmail(
    email: string
  ): Promise<IMerchantDocument> {
    const merchant: IMerchantDocument = (await MerchantModel.findOne({
      username: Helpers.firstLetterUppercase(email),
    }).exec()) as IMerchantDocument;
    return merchant;
  }

  public async getAuthMerchantByPasswordTokn(
    token: string
  ): Promise<IMerchantDocument> {
    const merchant: IMerchantDocument = (await MerchantModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    }).exec()) as IMerchantDocument;
    return merchant;
  }
}

export const merchantService: MerchantService = new MerchantService();
