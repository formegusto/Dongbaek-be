import Express from "express";
import DongbaekModel from "../models/dongbaek";

export default async function dongbaekCheck(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) {
  const { id } = req.params;
  const { id: _userId } = req.auth!;

  const dongbaek = await DongbaekModel.findById(id, {
    title: 1,
    image: 1,
    createdAt: 1,
    _id: 0,
    _userId: 1,
  });
  if (!dongbaek) {
    return res.status(404).json({
      message: "존재하지 않는 추억입니다.",
    });
  }

  if (dongbaek._userId !== _userId) {
    return res.status(401).json({
      message: "당신의 추억이 아닙니다.",
    });
  }

  req.dongbaek = dongbaek;

  return next();
}
