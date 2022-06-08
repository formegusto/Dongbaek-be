// Front-End 에서 사용하는 CSSGram 사용 form
export type Filter = {
  name: string;
  className: string;
};

// 사용자 촬영 설정 정보
export type Config = {
  filter?: Filter;
  timer?: number;
};

// 사용자 Document
export type Auth = {
  id?: string;
  username: string;
  password: string;
  token?: string;
  config?: Config;
};
