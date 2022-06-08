import Express from "express";
import fs from "fs";
import path from "path";

class IndexRouter {
  routes: Express.Router;

  constructor() {
    this.routes = Express.Router();

    // Setting Routes
    this.SetRoutes();
  }

  async SetRoutes() {
    // 현재 디렉터리에 있는 모든 router 파일들을 파싱하여 import 한다.
    const res = fs.readdirSync(path.resolve(__dirname));

    for (let i = 0; i < res.length; i++) {
      const routerFile = res[i];
      if (routerFile.includes("index")) continue;

      const _ = await import(path.resolve(__dirname, routerFile));
      const routePath = "/" + routerFile.split(".")[0];

      this.routes.use(routePath, _.default);
    }
  }
}

export default new IndexRouter().routes;
