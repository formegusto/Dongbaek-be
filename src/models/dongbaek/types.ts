import { Filter } from "../auth/types";

export type Dongbaek = {
  _id?: string;
  title: string;
  image: string;
  createdAt: string;
  _userId: string;
  filter?: Filter;
};

export type ReqDonbaek = {
  title: string;
  filterName: string;
  filterClass: string;
};
