import { User } from "@/entities/user";

export type RequestOtpReqDto = {
  email: string;
};

export type VerifyOtpReqDto = {
  email: string;
  otp: string;
};

export type ThirdPartyAuthReqDto = {
  token: string;
};

export type AuthResDto = {
  isNewUser: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
};
