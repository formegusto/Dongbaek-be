import Express from "express";
import multer from "multer";

const upload: Express.RequestHandler = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "static");
    },
    filename: (req, file, cb) => {
      cb(null, `pure-oneday-${Date.now()}.png`);
    },
  }),
}).single("image");

class DongbaekRouter {
  routes: Express.Router;

  constructor() {
    this.routes = Express.Router();
    this.SetRoutes();
  }

  SetRoutes() {
    this.routes.get("/", (req: Express.Request, res: Express.Response) => {
      return res.status(201).json({
        message: "Dongbaek List",
      });
    });

    this.routes.post(
      "/",
      upload,
      (req: Express.Request, res: Express.Response) => {
        console.log(req.file);
        return res.status(201).json({
          message: "Dongbaek 저장 API",
        });
      }
    );
  }
}

export default new DongbaekRouter().routes;
