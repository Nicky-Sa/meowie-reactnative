import { Text } from "react-native";

export const WarningText = () => {
  return (
    <Text className={"body-b1 text-neutral-10-default"}>
      We&#39;re sorry to see you go! Before you confirm, please read what will
      happen when you delete your Meowie account:{"\n"}
      Your account will be deleted, and all your data will be permanently
      removed. There is no way to recover your account or data after deletion
      and we keep no backups.
    </Text>
  );
};
