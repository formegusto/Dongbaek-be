import { model, Schema } from "mongoose";
import { Auth } from "./types";

const AuthSchema = new Schema<Auth>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    config: { type: Schema.Types.Mixed },
  },
  {
    collection: "Auth",
  }
);

const AuthModel = model<Auth>("Auth", AuthSchema);
export default AuthModel;
