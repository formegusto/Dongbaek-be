import { connect } from "mongoose";

// MongoDB Connect
// memo : mogoose랑 typescript가 반드시 같이 설치되어있어야 정상동작함
export default async function mongooseInit() {
  const { MONGO_HOST, MONGO_PORT, MONGO_APP } = process.env;
  const connectURL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_APP}`;
  await connect(connectURL);
  console.log("[mongoose] connected :)");
}
