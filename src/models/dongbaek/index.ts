import { model, Schema } from "mongoose";
import { Dongbaek } from "./types";

const DongbaekSchema = new Schema<Dongbaek>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    createdAt: { type: String, required: true },
    _userId: { type: String, required: true },
  },
  {
    collection: "Dongbaek",
  }
);

const DongbaekModel = model<Dongbaek>("Dongbaek", DongbaekSchema);
export default DongbaekModel;
