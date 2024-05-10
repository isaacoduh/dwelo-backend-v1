import { merchantWorker } from "./../../workers/merchant.worker";
import { IMerchantJob } from "./../../../v0/interfaces/merchant.interface";
import { BaseQueue } from "./base.queue";

class MerchantQueue extends BaseQueue {
  constructor() {
    super("merchant");
    this.processJob("addMerchantToDB", 5, merchantWorker.addMerchantToDB);
  }

  public addMerchantJob(name: string, data: IMerchantJob): void {
    this.addJob(name, data);
  }
}

export const merchantQueue: MerchantQueue = new MerchantQueue();
