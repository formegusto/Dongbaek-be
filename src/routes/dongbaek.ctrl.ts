import Express from "express";
import multer from "multer";
import loginCheck from "../middlewares/loginCheck";
import { Dongbaek, ReqDongbaek } from "../models/dongbaek/types";
import moment from "moment-timezone";
import DongbaekModel from "../models/dongbaek";
import dongbaekCheck from "../middlewares/dongbaekCheck";

const upload: Express.RequestHandler = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "static");
    },
    filename: (req, file, cb) => {
      cb(null, `dongbaek-${Date.now()}.png`);
    },
  }),
}).single("image");

class DongbaekRouter {
  routes: Express.Router;

  constructor() {
    this.routes = Express.Router();
    // Authorization Required
    this.routes.use(loginCheck);

    // Setting Routes
    this.SetRoutes();
  }

  SetRoutes() {
    // 사진 리스트 조회
    this.routes.get(
      "/",
      async (req: Express.Request, res: Express.Response) => {
        try {
          const { id: _userId } = req.auth!;
          const dongbaeks = await DongbaekModel.find(
            {
              _userId,
            },
            { title: 1, image: 1, createdAt: 1, filter: 1 }
          ).sort({ createdAt: -1 });

          return res.status(200).json({
            message: "Dongbaek List",
            dongbaeks,
          });
        } catch (err) {
          return res.status(500).json({
            message: "시스템 오류 입니다.",
          });
        }
      }
    );

    // 사진 상세 조회 API
    this.routes.get(
      "/:id",
      dongbaekCheck,
      async (req: Express.Request, res: Express.Response) => {
        try {
          const dongbaek = req.dongbaek!;

          return res.status(200).json({
            message: `조회가 완료되었습니다.`,
            dongbaek,
          });
        } catch (err) {
          return res.status(500).json({
            message: "시스템 오류 입니다.",
          });
        }
      }
    );

    // 사진 업로드 API
    this.routes.post(
      "/",
      upload,
      async (
        req: Express.Request<any, any, ReqDongbaek>,
        res: Express.Response
      ) => {
        const file = req.file;

        if (!file) {
          return res.status(400).json({
            message: "올바르지 않은 요청입니다.",
          });
        }

        try {
          const { title, filterName, filterClass } = req.body;
          const { path: image } = file;
          const { id: _userId } = req.auth!;
          const createdAt = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");

          const dongbaek = await DongbaekModel.create({
            title,
            image,
            _userId,
            createdAt,
            filter: {
              name: filterName,
              className: filterClass,
            },
          });

          return res.status(201).json({
            message: "성공적으로 저장 되었습니다.",
            dongbaek,
          });
        } catch (err) {
          console.error(err);
          return res.status(500).json({
            message: "시스템 오류 입니다.",
          });
        }
      }
    );

    // 사진 정보 수정 API
    this.routes.patch(
      "/:id",
      dongbaekCheck,
      async (
        req: Express.Request<any, any, { title: string }>,
        res: Express.Response
      ) => {
        try {
          const { id } = req.params;
          const { title } = req.body;

          console.log(`${id} 사진 수정 내용 : ${title}`);

          await DongbaekModel.updateOne(
            {
              _id: id,
            },
            {
              $set: {
                title: title,
              },
            }
          );
          const dongbaek = await DongbaekModel.findById(id, {
            title: 1,
            image: 1,
            createdAt: 1,
            filter: 1,
          });

          return res.status(200).json({
            message: "수정이 완료되었습니다.",
            dongbaek,
          });
        } catch (err) {
          return res.status(500).json({
            message: "시스템 오류 입니다.",
          });
        }
      }
    );

    // 사진 삭제 API
    this.routes.delete(
      "/:id",
      dongbaekCheck,
      async (req: Express.Request, res: Express.Response) => {
        try {
          const { id } = req.params!;
          const dongbaek = await DongbaekModel.deleteOne({
            _id: id,
          });

          return res.status(200).json({
            message: "삭제가 완료되었습니다.",
            dongbaek,
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

export default new DongbaekRouter().routes;
