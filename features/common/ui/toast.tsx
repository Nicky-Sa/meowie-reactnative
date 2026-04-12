import React from "react";
import { View, Text } from "react-native";
import { ToastConfig } from "react-native-toast-message";
import {
  CheckCircleSolid,
  InfoCircleSolid,
  XmarkCircleSolid,
} from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { tailwind } from "@/lib/tailwind";

// toast usage:
//     Toast.show({
//       type: "success",
//       text1: "Thanks for your feedback!",
//     });

type BaseToastContentProps = {
  text1?: string;
  icon: React.ReactNode;
  bgColor: string;
};

const BaseToastContent = ({ text1, icon, bgColor }: BaseToastContentProps) => (
  <View
    className={
      "w-[70%] flex-row items-center gap-2 rounded-full px-4 py-3 shadow-lg"
    }
    style={{
      backgroundColor: bgColor,
    }}
  >
    {icon}
    <Text className="body-b1 flex-1 text-neutral-10-default" numberOfLines={2}>
      {text1}
    </Text>
  </View>
);

type CustomToastProps = Pick<BaseToastContentProps, "text1">;

export const toastConfig: ToastConfig = {
  success: ({ text1 }: CustomToastProps) => (
    <BaseToastContent
      text1={text1}
      bgColor={tailwind.theme.backgroundColor.success["2"].default}
      icon={
        <Icon
          i={CheckCircleSolid}
          color={tailwind.theme.backgroundColor.success["1"].default}
        />
      }
    />
  ),
  error: ({ text1 }: CustomToastProps) => (
    <BaseToastContent
      text1={text1}
      bgColor={tailwind.theme.backgroundColor.error["2"].default}
      icon={
        <Icon
          i={XmarkCircleSolid}
          color={tailwind.theme.backgroundColor.orange["1"].default}
        />
      }
    />
  ),
  info: ({ text1 }: CustomToastProps) => (
    <BaseToastContent
      text1={text1}
      bgColor={tailwind.theme.backgroundColor.neutral["11"].default}
      icon={
        <Icon
          i={InfoCircleSolid}
          color={tailwind.theme.backgroundColor.neutral["1"].default}
        />
      }
    />
  ),
};
