import AuthModel from "../models/auth";
import jwt from "jsonwebtoken";
import { Auth } from "../models/auth/types";

export default async function refreshToken(isExisted: Auth) {
  const { id, username } = isExisted;
  const secret = process.env.JWT_SECRET!;
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

  return {
    token,
    auth: {
      id,
      username,
    },
  };
}
