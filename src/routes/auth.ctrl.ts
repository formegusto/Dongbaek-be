import Express from "express";

class AuthRouter {
  routes: Express.Router;

  constructor() {
    this.routes = Express.Router();
    this.SetRoutes();
  }

  SetRoutes() {
    this.routes.post(
      "/sign-in",
      (req: Express.Request, res: Express.Response) => {
        return res.status(200).json({
          message: "로그인 API",
        });
      }
    );

    this.routes.post(
      "/sign-up",
      (req: Express.Request, res: Express.Response) => {
        return res.status(201).json({
          message: "가입 API",
        });
      }
    );
  }
}

export default new AuthRouter().routes;
