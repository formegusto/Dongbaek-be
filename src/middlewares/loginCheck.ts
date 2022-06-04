import Express from "express";
import jwt from "jsonwebtoken";
import { Auth } from "../models/auth/types";

export default async function loginCheck(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) {
  const secret = process.env.JWT_SECRET!;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "로그인이 필요한 서비스입니다.",
    });
  }

  try {
    const auth = jwt.verify(token, secret) as Auth;
    req.auth = auth;

    return next();
  } catch (err) {
    return res.status(401).json({
      message: "Bad Token",
    });
  }
}
