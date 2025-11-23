export type DeleteAccountReqDto = {
  email: string;
  churnReasonId?: string;
};

export type DeleteAccountResDto = {
  successful: boolean;
};
