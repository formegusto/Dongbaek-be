import Express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

class App {
  server: Express.Application;

  constructor() {
    this.server = Express();

    this.SetMW();
    this.Start();
  }

  SetMW() {
    this.server.use(morgan("dev"));
  }

  Start() {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;

    this.server.listen(port, () => {
      console.log(`[Express] Server Listen PORT ${port} :)`);
    });
  }
}

export default new App();
