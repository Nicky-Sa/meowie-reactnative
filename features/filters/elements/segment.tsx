import { Button } from "@/features/common/button";
import { tailwind } from "@/lib/utils";
import { Text } from "react-native";
import { Updater } from "use-immer";

export type FilterItem = {
  id: string;
  name: string;
};

type Props = {
  item: FilterItem;
  setCurrentValues: Updater<string[]>;
  isSelected: boolean;
  multiple?: boolean;
};

export const Segment = ({
  item,
  setCurrentValues,
  isSelected,
  multiple,
}: Props) => {
  return (
    <Button
      variant={isSelected ? "selected-segment" : "unselected-segment"}
      size={"segment"}
      onPress={() => {
        setCurrentValues((draft) => {
          const index = draft.indexOf(item.id);
          if (multiple) {
            if (index === -1) {
              draft.push(item.id);
            } else {
              draft.splice(index, 1);
            }
          } else {
            draft.length = 0;
            if (index === -1) {
              draft.push(item.id);
            }
          }
        });
      }}
      style={{
        ...(isSelected && {
          borderColor: tailwind.theme.borderColor.brand[1].default,
        }),
      }}
    >
      <Text className={"body-b1-strong text-neutral-10-default"}>
        {item.name}
      </Text>
    </Button>
  );
};
