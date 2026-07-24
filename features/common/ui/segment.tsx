import { Lock } from "iconoir-react-native";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { cn, tailwind } from "@/lib/tailwind";
import { Text, View } from "react-native";
import { Updater } from "use-immer";
import { Draft } from "immer";
import { ReactNode, useCallback } from "react";

const LOCK_ICON_SIZE = 20;

type Primitive = string | number | boolean;

export type SegmentItem<T extends Primitive = string> = {
  id: T;
  label: string;
  description?: string;
  icon?: ReactNode;
};

type Props<T extends Primitive> = {
  item: SegmentItem<T>;
  centered?: boolean;
  // Grow to take a share of the parent column's free space (tall cards).
  fill?: boolean;
  // Always shown as selected and ignores taps.
  locked?: boolean;
  className?: string;
} & (Multiple<T> | Single<T>);

type Multiple<T extends Primitive> = {
  multiple: true;
  currentValues: T[];
  setCurrentValues: Updater<T[]>;
};

type Single<T extends Primitive> = {
  multiple?: false;
  currentValues: T;
  setCurrentValues: Updater<T>;
};

export const Segment = <T extends Primitive = string>({
  item,
  currentValues,
  setCurrentValues,
  multiple,
  centered,
  fill,
  locked,
  className,
}: Props<T>) => {
  const isSelected =
    locked ||
    (multiple ? currentValues.includes(item.id) : currentValues === item.id);

  const onPress = useCallback(() => {
    if (locked) return;
    if (multiple) {
      setCurrentValues((draft) => {
        const id = item.id as Draft<T>;
        if (draft.includes(id)) {
          draft.splice(draft.indexOf(id), 1);
        } else {
          draft.push(id);
        }
      });
    } else {
      setCurrentValues(item.id);
    }
  }, [locked, multiple, setCurrentValues, item.id]);

  return (
    <Button
      variant={isSelected ? "selected-segment" : "unselected-segment"}
      size={"segment"}
      onPress={onPress}
      fill={fill}
      className={cn(centered && "justify-center", fill && "flex-1", className)}
    >
      <View
        className={cn(
          "flex flex-col gap-2",
          centered ? "items-center" : "items-start",
        )}
      >
        {item.icon}
        <View className={"flex w-full flex-row items-center justify-between"}>
          <View className={"flex flex-row items-center gap-1"}>
            <Text className={cn("body-b1-strong text-neutral-10-default")}>
              {item.label}
            </Text>
          </View>
          {locked && (
            <Icon
              i={Lock}
              width={LOCK_ICON_SIZE}
              height={LOCK_ICON_SIZE}
              color={tailwind.theme.textColor.neutral[6].default}
            />
          )}
        </View>
        {item.description && (
          <Text className={"body-b2 text-neutral-6-default"}>
            {item.description}
          </Text>
        )}
      </View>
    </Button>
  );
};
