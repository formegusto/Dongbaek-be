import Express from "express";
import multer from "multer";
import path from "path";

const upload: Express.RequestHandler = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "static");
    },
    filename: (req, file, cb) => {
      cb(null, `mailbox-image-${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
}).single("image");

class DongbaekRouter {
  routes: Express.Router;

  constructor() {
    this.routes = Express.Router();
  }
}

export default new DongbaekRouter().routes;
