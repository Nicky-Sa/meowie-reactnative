import { Button } from "@/components/common/button";
import { tailwind } from "@/lib/utils";
import { Text } from "react-native";
import { Updater } from "use-immer/dist";

type Props = {
  item: string;
  currentValues: string[];
  setCurrentValues: Updater<string[]>;
  multiple?: boolean;
};

export const Selectable = ({
  item,
  currentValues,
  setCurrentValues,
  multiple,
}: Props) => {
  return (
    <Button
      variant={currentValues.includes(item) ? "secondary" : "outline"}
      size={"full"}
      onPress={() => {
        setCurrentValues((draft) => {
          const index = draft.indexOf(item);
          if (multiple) {
            if (index === -1) {
              draft.push(item);
            } else {
              draft.splice(index, 1);
            }
          } else {
            draft.length = 0;
            if (index === -1) {
              draft.push(item);
            }
          }
        });
      }}
      style={{
        ...(currentValues.includes(item) && {
          borderColor: tailwind.theme.borderColor.brand[1].default,
        }),
      }}
    >
      <Text className={"body-b1-strong text-neutral-10-default"}>{item}</Text>
    </Button>
  );
};
