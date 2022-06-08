import AuthModel from "../models/auth";
import jwt from "jsonwebtoken";
import { Auth } from "../models/auth/types";

export default async function refreshToken(isExisted: Auth) {
  const { id, username } = isExisted;
  const secret = process.env.JWT_SECRET!;
  // JWT 재발급
  const token = jwt.sign(
    {
      id,
      username,
    },
    secret,
    {
      algorithm: "HS256",
      expiresIn: "3h",
    }
  );

  await AuthModel.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        token: token,
      },
    }
  );

  // Front End에서 필요로 하는 인증정보들을 한꺼번에 담아서 반환해준다.
  return {
    token,
    auth: {
      id,
      username,
    },
  };
}
