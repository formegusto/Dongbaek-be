import Express from "express";
import DongbaekModel from "../models/dongbaek";

export default async function dongbaekCheck(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) {
  // 1. Path Parameter id = Dongbaek Document ID, req.auth = Auth Document ID
  const { id } = req.params;
  const { id: _userId } = req.auth!;

  // 2. Find dongbaek with ID
  const dongbaek = await DongbaekModel.findById(id, {
    title: 1,
    image: 1,
    createdAt: 1,
    _id: 0,
    _userId: 1,
  });

  // 3. isEmpty
  if (!dongbaek) {
    return res.status(404).json({
      message: "존재하지 않는 추억입니다.",
    });
  }

  // 4. dongbaek을 만든 사용자의 아이디와 현재 이 API를 요청한 인증정보의 사용자 ID가 같은지 확인
  if (dongbaek._userId !== _userId) {
    return res.status(401).json({
      message: "당신의 추억이 아닙니다.",
    });
  }

  // 5. request 객체에 dongbaek document 객체를 담아서 다음 라우터에 넘겨준다.
  req.dongbaek = dongbaek;

  return next();
}
