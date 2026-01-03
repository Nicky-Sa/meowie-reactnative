import { PropsWithChildren } from "react";
import { View } from "react-native";

export const TabContent = ({ children }: PropsWithChildren) => {
  return (
    <>
      {/* To account for The height of the tab bar 👇🏻 */}
      <View className={"h-14"} />
      {children}
    </>
  );
};
