import Express from "express";
import loginCheck from "../middlewares/loginCheck";
import AuthModel from "../models/auth";
import { Auth, Config } from "../models/auth/types";

class ConfigRouter {
  routes: Express.Router;

  constructor() {
    this.routes = Express.Router();
    this.routes.use(loginCheck);
    this.SetRoutes();
  }

  SetRoutes() {
    this.routes.get(
      "/",
      async (req: Express.Request<any, any, Config>, res: Express.Response) => {
        try {
          const { id } = req.auth!;
          const { config } = (await AuthModel.findById(id)) as Auth;

          return res.status(200).json({
            message: "설정을 확인해주세요 :)",
            config,
          });
        } catch (err) {
          return res.status(500).json({
            message: "시스템 오류 입니다.",
          });
        }
      }
    );

    this.routes.patch(
      "/",
      async (req: Express.Request<any, any, Config>, res: Express.Response) => {
        try {
          const { id } = req.auth!;
          const config = req.body;

          const check = await AuthModel.findById(
            { _id: id },
            { config: 1, _id: 0 }
          );
          if (check?.config) {
            await AuthModel.updateOne(
              { _id: id },
              { $set: { config: { ...check.config, ...config } } }
            );
          } else {
            await AuthModel.updateOne(
              { _id: id },
              { $set: { config: config } }
            );
          }

          return res.status(200).json({
            message: "설정 변경이 완료 되었습니다. :)",
          });
        } catch (err) {
          return res.status(500).json({
            message: "시스템 오류 입니다.",
          });
        }
      }
    );
  }
}

export default new ConfigRouter().routes;
