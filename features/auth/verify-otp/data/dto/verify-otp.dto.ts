export type VerifyOtpReqDto = {
  email: string;
  otp: string;
};

export type VerifyOtpResDto = {
  isValid: boolean;
};
