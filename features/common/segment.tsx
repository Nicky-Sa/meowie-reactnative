import { Button } from "@/features/common/button";
import { tailwind } from "@/lib/utils";
import { Text } from "react-native";
import { Updater } from "use-immer";

export type SegmentItem = {
  id: string;
  label: string;
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
      <Text className={"body-b1-strong text-neutral-10-default"}>
        {item.label}
      </Text>
    </Button>
  );
};
