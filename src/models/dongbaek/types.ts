import { Filter } from "../auth/types";

export type Dongbaek = {
  _id?: string;
  title: string;
  image: string;
  createdAt: string;
  _userId: string;
  filter?: Filter;
};

// Dongbaek 업로드 시, image를 제외한 요청 정보
export type ReqDongbaek = {
  title: string;
  filterName: string;
  filterClass: string;
};
