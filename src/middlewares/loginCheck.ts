import Express from "express";
import jwt from "jsonwebtoken";
import { Auth } from "../models/auth/types";

export default async function loginCheck(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) {
  const secret = process.env.JWT_SECRET!;

  // 1. Request Header에서 인증 정보 (eq. JWT Token) PArsing
  const token = req.headers.authorization;

  // 2. Auhtorization이 공란일 경우ㅡ 401 Unauthorized
  if (!token) {
    return res.status(401).json({
      message: "로그인이 필요한 서비스입니다.",
    });
  }

  try {
    // 4. Token 유효성 검사
    const auth = jwt.verify(token, secret) as Auth;

    // 5. 다음 라우터에서 인증 정보를 필요로 할 수 있으니, request 객체에 담아서 넘겨준다.
    req.auth = auth;

    return next();
  } catch (err) {
    // 6-err. 유효하지 않은 토큰으로 401 Unauthorized
    return res.status(401).json({
      message: "Bad Token",
    });
  }
}
