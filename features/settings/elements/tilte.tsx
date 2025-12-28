import { Text } from "react-native";
import { PropsWithChildren } from "react";

export const Title = ({ children }: PropsWithChildren) => {
  return <Text className={"body-b1 text-neutral-10-default"}>{children}</Text>;
};
