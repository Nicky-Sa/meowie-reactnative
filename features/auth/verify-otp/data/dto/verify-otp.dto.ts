export type VerifyOtpReqDto = {
  email: string;
  otp: string;
};

export type VerifyOtpResDto = {
  isNewUser: boolean;
  accessToken: string;
  refreshToken: string;
};
