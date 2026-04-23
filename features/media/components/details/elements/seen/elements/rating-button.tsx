import { Button } from "@/features/common/ui/button";
import { Text, View } from "react-native";
import { cn } from "@/lib/tailwind";
import { Icon, SvgImage } from "@/features/common/ui/icon";

type Props = {
  value: number;
  isSelected: boolean;
  icon: SvgImage;
  handleRate: (value: number) => void;
};

export const RatingButton = ({
  handleRate,
  value,
  isSelected,
  icon,
}: Props) => {
  return (
    <Button variant={"ghost"} size={"unset"} onPress={() => handleRate(value)}>
      <View
        className={cn(
          "flex flex-col items-center gap-2 rounded-xl border border-neutral-3-default p-2",
          isSelected && "bg-brand-1-default",
        )}
      >
        <Icon i={icon} width={48} height={48} />
        <Text className="body-b2 text-neutral-10-default">{value}</Text>
      </View>
    </Button>
  );
};
