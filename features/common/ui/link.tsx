import { Href, Link as ExpoLink } from "expo-router";
import { PropsWithChildren } from "react";
import { Pressable } from "react-native";

type Props = {
  href: Href;
  onPress?: () => void;
};

export const Link = ({ href, onPress, children }: PropsWithChildren<Props>) => {
  return (
    <ExpoLink href={href} onPress={onPress} asChild>
      <Pressable>{children}</Pressable>
    </ExpoLink>
  );
};
