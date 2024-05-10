import { merchantRoutes } from "./v0/routes/merchant.routes";
import { Application, Request, Response } from "express";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
const v0_BASE_PATH = "/api/v0";

export default (app: Application) => {
  const routes = () => {
    app.get("/v0-health", (_req: Request, res: Response) => {
      res
        .status(HTTP_STATUS.OK)
        .send(
          `Health: Server instance is healthy with process id ${
            process.pid
          } on ${moment().format("LL")}`
        );
    });
    app.use(v0_BASE_PATH, merchantRoutes.routes());
  };
  routes();
};
