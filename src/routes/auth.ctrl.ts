import Express from "express";
import AuthModel from "../models/auth";
import { Auth } from "../models/auth/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthRouter {
  routes: Express.Router;

  constructor() {
    this.routes = Express.Router();
    this.SetRoutes();
  }

  SetRoutes() {
    this.routes.post(
      "/sign-in",
      async (req: Express.Request<any, any, Auth>, res: Express.Response) => {
        const { username, password } = req.body;
        try {
          const auth = await AuthModel.findOne({
            username,
          });

          if (!auth) {
            return res.status(401).json({
              message: "존재하지 않는 계정입니다.",
            });
          }
          const { id, username: _username, password: _password } = auth;

          const hashCheck = await bcrypt.compare(password, _password);
          if (!hashCheck) {
            return res.status(401).json({
              message: "존재하지 않는 계정입니다.",
            });
          }

          const token = await jwt.sign(
            {
              id,
              username: _username,
            },
            process.env.JWT_SECRET!,
            {
              expiresIn: "3h",
            }
          );

          return res.status(200).json({
            message: "성공적으로 로그인 되었습니다.",
            token,
          });
        } catch (err) {
          return res.status(500).json({
            message: "시스템 오류 입니다.",
          });
        }
      }
    );

    this.routes.post(
      "/sign-up",
      async (req: Express.Request<any, any, Auth>, res: Express.Response) => {
        const { username, password, config } = req.body;

        console.log(username);

        try {
          const isExist = await AuthModel.findOne({
            username: username,
          });

          console.log(isExist);

          if (isExist) {
            return res.status(400).json({
              message: "이미 존재하는 계정입니다.",
            });
          }

          const _password = await bcrypt.hash(password, 10);
          const auth: Auth = {
            username,
            password: _password,
            config,
          };
          const { id } = await AuthModel.create(auth);
          const _auth = await AuthModel.findById(id);

          if (_auth) {
            const { id, username } = _auth;
            const secret = process.env.JWT_SECRET!;
            const token = jwt.sign(
              {
                id,
                username,
              },
              secret,
              {
                algorithm: "HS256",
                expiresIn: "3h",
              }
            );

            return res.status(201).json({
              message: "가입이 완료 되었습니다.",
              token,
            });
          } else {
            throw new Error("");
          }
        } catch (err) {
          return res.status(500).json({
            message: "시스템 오류 입니다.",
          });
        }
      }
    );

    this.routes.get("/check", (req: Express.Request, res: Express.Response) => {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(400).json({
          message: "Authorization Required",
        });
      } else {
        try {
          const secret = process.env.JWT_SECRET!;
          const { id, username } = jwt.verify(token, secret) as Auth;

          return res.status(200).json({
            message: "Token Check Success",
            auth: {
              id,
              username,
            },
          });
        } catch (err) {
          return res.status(401).json({
            message: "Bad Token",
          });
        }
      }
    });
  }
}

export default new AuthRouter().routes;
