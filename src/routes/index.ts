import Express from "express";
import fs from "fs";
import path from "path";

class IndexRouter {
  routes: Express.Router;

  constructor() {
    this.routes = Express.Router();
    this.SetRoutes();
  }

  async SetRoutes() {
    const res = fs.readdirSync(path.resolve(__dirname));

    for (let i = 0; i < res.length; i++) {
      const routerFile = res[i];
      if (routerFile.includes("index") || routerFile.includes("process"))
        continue;

      const _ = await import(path.resolve(__dirname, routerFile));
      const routePath = "/" + routerFile.split(".")[0];

      this.routes.use(routePath, _.default);
    }
  }
}

export default new IndexRouter().routes;
