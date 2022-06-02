export type Filter = {
  name: string;
  className: string;
};

export type Config = {
  filter?: Filter;
};

export type Auth = {
  id?: string;
  username: string;
  password: string;
  config?: Config;
};
