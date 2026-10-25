import { View, Text } from "react-native";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { NavArrowLeft } from "iconoir-react-native";
import { useRouter } from "expo-router";
import { ReactNode, memo } from "react";
import { HeaderContainer } from "@/features/common/layout/header-container";

type Props = {
  title: string;
  subtitle?: string;
  rightTopComponent?: ReactNode;
};
export const Header = memo(({ title, subtitle, rightTopComponent }: Props) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <HeaderContainer className={"absolute z-10 flex-1"}>
      <View className={"flex flex-row items-center"}>
        <Button
          onPress={handleBack}
          variant={"ghost"}
          size={"md"}
          iconPosition={"only"}
          icon={<Icon i={NavArrowLeft} />}
        />
        <View className={"mr-2 flex flex-1 flex-col gap-0.5"}>
          <Text
            numberOfLines={1}
            className={"title-t2-strong text-neutral-10-default"}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              numberOfLines={1}
              className={"body-b1 h-6 text-neutral-5-default"}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightTopComponent}
    </HeaderContainer>
  );
});

Header.displayName = "Header";
