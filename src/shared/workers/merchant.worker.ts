import { merchantService } from "./../../v0/services/merchant.service";
import { config } from "./../../config";
import { DoneCallback, Job } from "bull";
import Logger from "bunyan";

const log: Logger = config.createLogger("merchantWorker");

class MerchantWorker {
  async addMerchantToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await merchantService.createMerchant(value);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
    }
  }
}
export const merchantWorker: MerchantWorker = new MerchantWorker();
