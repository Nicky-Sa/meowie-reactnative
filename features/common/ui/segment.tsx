import { Button } from "@/features/common/ui/button";
import { tailwind } from "@/lib/tailwind";
import { Text, View } from "react-native";
import { Updater } from "use-immer";
import { Draft } from "immer";

type Primitive = string | number | boolean;

export type SegmentItem<T extends Primitive = string> = {
  id: T;
  label: string;
  description?: string;
};

type Props<T extends Primitive> = {
  item: SegmentItem<T>;
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
}: Props<T>) => {
  const isSelected = multiple
    ? currentValues.includes(item.id)
    : currentValues === item.id;
  return (
    <Button
      variant={isSelected ? "selected-segment" : "unselected-segment"}
      size={"segment"}
      onPress={() => {
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
      }}
      style={{
        ...(isSelected && {
          borderColor: tailwind.theme.borderColor.brand[1].default,
        }),
      }}
    >
      <View className={"flex flex-col items-start gap-2"}>
        <Text className={"body-b1-strong text-neutral-10-default"}>
          {item.label}
        </Text>
        {item.description && (
          <Text className={"body-b2 text-neutral-6-default"}>
            {item.description}
          </Text>
        )}
      </View>
    </Button>
  );
};
