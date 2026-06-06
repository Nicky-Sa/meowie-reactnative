export type DeleteUserReqDto = {
  email: string;
  churnReasonId?: string;
};

export type DeleteUserResDto = {
  successful: boolean;
};
