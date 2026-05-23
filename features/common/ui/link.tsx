import { Href, Link as ExpoLink } from "expo-router";
import { PropsWithChildren } from "react";
import { Pressable } from "react-native";

type Props = {
  href: Href;
};

export const Link = ({ href, children }: PropsWithChildren<Props>) => {
  return (
    <ExpoLink href={href} asChild>
      <Pressable>{children}</Pressable>
    </ExpoLink>
  );
};
