import { Action } from "@/features/common/ui/action";
import { Switch } from "@/features/common/ui/switch";
import { Text, View } from "react-native";
import { useAtom } from "jotai";
import { autoplayAtom } from "@/atoms";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";

export const Autoplay = () => {
  const [value, setValue] = useAtom(autoplayAtom);
  const { capture } = useCaptureEvent();

  const handleToggle = () => {
    capture("autoplay_toggled", { autoplay: !value });
    setValue(!value);
  };

  return (
    <Action variant={"black"} size={"lg"} onPress={handleToggle}>
      <View className={"flex w-full flex-row items-center justify-between"}>
        <Text className={"body-b1-strong text-neutral-10-default"}>
          Autoplay trailer
        </Text>
        <Switch value={value} onValueChange={setValue} />
      </View>
    </Action>
  );
};
