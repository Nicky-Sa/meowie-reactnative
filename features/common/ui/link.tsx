import { Href, Link as ExpoLink } from "expo-router";
import { PropsWithChildren } from "react";
import { Pressable } from "react-native";
import { WithTestID } from "@/features/common/test-id";

type Props = {
  href: Href;
  onPress?: () => void;
};

export const Link = ({
  href,
  onPress,
  testID,
  children,
}: PropsWithChildren<WithTestID<Props>>) => {
  return (
    <ExpoLink href={href} onPress={onPress} asChild>
      <Pressable testID={testID}>{children}</Pressable>
    </ExpoLink>
  );
};
