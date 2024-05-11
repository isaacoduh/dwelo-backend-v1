import { Helpers } from "./../../shared/helpers/helpers";
import { ServerError } from "./../../shared/helpers/error-handler";
import { config } from "./../../config";
import { IMerchantDocument } from "./../../v0/interfaces/merchant.interface";
import { BaseCache } from "./base.cache";
import Logger from "bunyan";
import { RedisCommandRawReply } from "@redis/client/dist/lib/commands";

const log: Logger = config.createLogger("merchantCache");
type MerchantItem = string;
type MerchantCacheMultiType =
  | string
  | number
  | Buffer
  | RedisCommandRawReply[]
  | IMerchantDocument
  | IMerchantDocument[];

export class MerchantCache extends BaseCache {
  constructor() {
    super("merchantCache");
  }

  public async saveMerchantToCache(
    key: string,
    merchantMId: string,
    createdMerchant: IMerchantDocument
  ): Promise<void> {
    const createdAt = new Date();
    const { _id, mId, fullname, username, email, phone } = createdMerchant;
    const dataToSave = {
      _id: `${_id}`,
      mId: `${mId}`,
      fullname: `${fullname}`,
      username: `${username}`,
      email: `${email}`,
      phone: `${phone}`,
      createdAt: `${createdAt}`,
    };

    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.ZADD("merchant", {
        score: parseInt(merchantMId, 10),
        value: `${key}`,
      });
      for (const [itemKey, itemValue] of Object.entries(dataToSave)) {
        await this.client.HSET(
          `merchants:${key}`,
          `${itemKey}`,
          `${itemValue}`
        );
      }
    } catch (error) {
      log.error(error);
      throw new ServerError("Server Error. Try again.");
    }
  }

  public async getMerchantFromCache(
    merchantId: string
  ): Promise<IMerchantDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const response: IMerchantDocument = (await this.client.HGETALL(
        `merchants:${merchantId}`
      )) as unknown as IMerchantDocument;
      response.createdAt = new Date(Helpers.parseJson(`${response.createdAt}`));
      return response;
    } catch (error) {
      log.error(error);
      throw new ServerError("Server Error. try again");
    }
  }

  public async getTotalMerchantsInCache(): Promise<number> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const count: number = await this.client.ZCARD("merchant");
      return count;
    } catch (error) {
      log.error(error);
      throw new ServerError("Server error. try again");
    }
  }
}
