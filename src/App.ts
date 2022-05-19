import Express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes";
import mongooseInit from "./models";

dotenv.config();

class App {
  server: Express.Application;

  constructor() {
    this.server = Express();

    this.SetMW();
    this.Start();
  }

  SetMW() {
    this.server.use(cors());
    this.server.use(morgan("dev"));
    this.server.use(Express.json());
    this.server.use("/static", Express.static("static"));

    this.server.use(routes);
  }

  Start() {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;

    this.server.listen(port, () => {
      console.log(`[Express] Server Listen PORT ${port} :)`);
      (async function () {
        await mongooseInit();
      })();
    });
  }
}

export default new App();
