declare namespace Express {
  export interface Request {
    auth?: {
      id?: string;
      username: string;
    };
    dongbaek?: {
      id?: string;
      title: string;
      image: string;
      createdAt: string;
      _userId: string;
    };
  }
}
