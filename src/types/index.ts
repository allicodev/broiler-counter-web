import User from "@/app/user/user.types";

export interface Response {
  code: number;
  success: boolean;
  message?: string;
}

export interface ExtendedResponse<T> extends Response {
  data?: T;
  meta?: {
    total: number;
    [key: string]: any;
  };
}

export interface Broiler {
  _id?: string;
  user?: User;
  count: number;
  price: number;
  totalAmount: number;
  createdAt: Date;
  month?: number;
}
