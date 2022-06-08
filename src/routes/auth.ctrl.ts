import Express from "express";
import AuthModel from "../models/auth";
import { Auth } from "../models/auth/types";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import refreshToken from "../utils/refreshToken";

class AuthRouter {
  routes: Express.Router;

  constructor() {
    this.routes = Express.Router();
    // Setting Routes
    this.SetRoutes();
  }

  SetRoutes() {
    // 로그인 API
    this.routes.post(
      "/sign-in",
      async (req: Express.Request<any, any, Auth>, res: Express.Response) => {
        const { username, password } = req.body;
        try {
          // 1. 존재여부 확인
          const auth = await AuthModel.findOne({
            username,
          });

          if (!auth) {
            return res.status(401).json({
              message: "존재하지 않는 계정입니다.",
            });
          }

          // 2. 있다면, 패스워드 해시 검사
          const { id, username: _username, password: _password } = auth;
          const hashCheck = await bcrypt.compare(password, _password);
          if (!hashCheck) {
            return res.status(401).json({
              message: "존재하지 않는 계정입니다.",
            });
          }

          // 3. 성공 시 JWT 토큰 발급 및 반환
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

          // 3-+. 사용자의 Document의 token 값을 변경시킨다.
          await AuthModel.updateOne(
            {
              _id: id,
            },
            {
              $set: {
                token: token,
              },
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

    // 회원가입 API
    this.routes.post(
      "/sign-up",
      async (req: Express.Request<any, any, Auth>, res: Express.Response) => {
        const { username, password, config } = req.body;

        try {
          // 1. 중복여부 확인
          const isExist = await AuthModel.findOne({
            username: username,
          });

          if (isExist) {
            return res.status(400).json({
              message: "이미 존재하는 계정입니다.",
            });
          }

          // 2. 패스워드 해시 암호화
          const _password = await bcrypt.hash(password, 10);

          // 3. 사용자 생성
          const auth: Auth = {
            username,
            password: _password,
            config,
          };
          const { _id } = await AuthModel.create(auth);
          const _auth = await AuthModel.findById(_id);

          // 4. 성공적으로 Document가 저장되었다면, JWT 토큰 발급 후 응답
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
            await AuthModel.updateOne(
              {
                _id: id,
              },
              {
                $set: {
                  token: token,
                },
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

    // 토큰 체크 API
    this.routes.get(
      "/check",
      async (req: Express.Request, res: Express.Response) => {
        // 1. 토큰 존재 여부 확인
        const token = req.headers.authorization;

        if (!token) {
          return res.status(401).json({
            message: "Authorization Required",
          });
        } else {
          // 2. 토큰 유효성 검사
          try {
            const secret = process.env.JWT_SECRET!;
            const { id, username } = jwt.verify(token, secret) as Auth;

            // 3. 토큰 복호화 결과 (eq. 인증정보) 응답
            return res.status(200).json({
              message: "Token Check Success",
              auth: {
                id,
                username,
              },
            });
          } catch (err) {
            // 2-err. JWT 유효성 검사중 기간 만료인 경우
            if ((err as JsonWebTokenError).message === "jwt expired") {
              // 2-err-2. 해당 토큰이 사용자가 마지막으로 로그인한 토큰이 맞는지 확인한다.
              const isExisted = await AuthModel.findOne({
                token: token,
              });

              // 2-err-3. 맞다면 새로운 토큰을 발급해준다.
              if (isExisted) {
                return res.status(201).json({
                  message: "new token refresh",
                  ...(await refreshToken(isExisted)),
                });
              }
            }
            // 2-err-4.마지막 로그인 한 곳에서의 토큰이 아니라면 에러상태를 응답한다.
            return res.status(401).json({
              message: "Bad Token",
            });
          }
        }
      }
    );
  }
}

export default new AuthRouter().routes;
