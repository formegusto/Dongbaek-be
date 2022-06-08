import Express from "express";
import loginCheck from "../middlewares/loginCheck";
import AuthModel from "../models/auth";
import { Auth, Config } from "../models/auth/types";

class ConfigRouter {
  routes: Express.Router;

  constructor() {
    this.routes = Express.Router();
    // Authorization Required
    this.routes.use(loginCheck);

    // Setting Routes
    this.SetRoutes();
  }

  SetRoutes() {
    // 사용자 촬영 설정 정보 조회 API
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

    // 사용자 촬영 설정 정보 수정 API
    this.routes.patch(
      "/",
      async (req: Express.Request<any, any, Config>, res: Express.Response) => {
        try {
          const { id } = req.auth!;
          const config = req.body;

          // filter설정 정보만 들어올 수 있고, timer 설정 정보만 들어올 수 있다.
          // 유효성 검사를 위해 한번 조회한 후
          // 스프레드 문법으로 무결성을 지켜준 후, 사용자가 보내온 값만 수정이 되도록 한다.
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
            // 첫 가입시에는 config 정보가 없을 수 있기 때문에
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
