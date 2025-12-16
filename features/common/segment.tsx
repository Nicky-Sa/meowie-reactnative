import { Button } from "@/features/common/button";
import { tailwind } from "@/lib/tailwind";
import { Text, View } from "react-native";
import { Updater } from "use-immer";

export type SegmentItem = {
  id: string;
  label: string;
  description?: string;
};

type Props = {
  item: SegmentItem;
} & (Multiple | Single);

type Multiple = {
  multiple: true;
  currentValues: string[];
  setCurrentValues: Updater<string[]>;
};

type Single = {
  multiple?: false;
  currentValues: string;
  setCurrentValues: Updater<string>;
};

export const Segment = ({
  item,
  currentValues,
  setCurrentValues,
  multiple,
}: Props) => {
  const isSelected = currentValues.includes(item.id);
  return (
    <Button
      variant={isSelected ? "selected-segment" : "unselected-segment"}
      size={"segment"}
      onPress={() => {
        if (multiple) {
          setCurrentValues((draft) => {
            if (draft.includes(item.id)) {
              draft.splice(draft.indexOf(item.id), 1);
            } else {
              draft.push(item.id);
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
