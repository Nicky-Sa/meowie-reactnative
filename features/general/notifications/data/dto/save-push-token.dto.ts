export type SavePushTokenReqDto = {
  // null when the phone has no permission for notifications
  pushToken: string | null;
};
