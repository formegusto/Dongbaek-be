export type Filter = {
  name: string;
  className: string;
};

export type Config = {
  filter?: Filter;
  timer?: number;
};

export type Auth = {
  id?: string;
  username: string;
  password: string;
  config?: Config;
};
