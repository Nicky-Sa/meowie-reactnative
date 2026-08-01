import { Button } from "@/features/common/ui/button";
import { Option } from "@/features/common/option";
import { cn } from "@/lib/tailwind";
import { Text, View } from "react-native";
import { Updater } from "use-immer";
import { Draft } from "immer";
import { ReactNode, useCallback } from "react";

type Primitive = string | number | boolean;

// Every visible part is optional: an icon on its own is a whole segment, and so
// is a label on its own.
export type SegmentItem<T extends Primitive = string> = Omit<
  Option<T>,
  "label"
> & {
  label?: string;
  icon?: ReactNode;
};

type Props<T extends Primitive> = {
  item: SegmentItem<T>;
  className?: string;
  centered?: boolean;
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
  className,
  centered,
}: Props<T>) => {
  const isSelected = multiple
    ? currentValues.includes(item.id)
    : currentValues === item.id;

  const onPress = useCallback(() => {
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
  }, [multiple, setCurrentValues, item.id]);

  return (
    <Button
      variant={isSelected ? "selected-segment" : "unselected-segment"}
      size={"segment"}
      onPress={onPress}
      className={cn(className)}
    >
      <View
        className={cn(
          // Grows to fill a full-width row, but keeps its own width in a
          // wrapping row of chips — flex-1 would collapse those to nothing.
          "flex flex-grow flex-row items-center gap-3",
          // Nothing to line up against, so what is left sits in the middle.
          centered ? "justify-center" : "justify-start",
        )}
      >
        {item.icon}
        {(item.label || item.description) && (
          <View className={"flex flex-col gap-1"}>
            {item.label && (
              <Text className={"body-b1-strong text-neutral-10-default"}>
                {item.label}
              </Text>
            )}
            {item.description && (
              <Text className={"body-b2 text-neutral-6-default"}>
                {item.description}
              </Text>
            )}
          </View>
        )}
      </View>
    </Button>
  );
};
