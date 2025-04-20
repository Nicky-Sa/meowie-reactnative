import { Button } from "@/components/common/button";
import { tailwind } from "@/lib/utils";
import { Text } from "react-native";
import { useAtom } from "jotai/index";
import { Filters, filtersAtom } from "@/atoms";

type Props = {
  item: string;
  filterKey: keyof Filters;
  multiple?: boolean;
};

export const Selectable = ({ item, filterKey, multiple }: Props) => {
  const [filters, setFilters] = useAtom(filtersAtom);

  return (
    <Button
      variant={filters[filterKey].includes(item) ? "secondary" : "outline"}
      size={"full"}
      onPress={() => {
        setFilters((draft) => {
          if(multiple){
            if (draft[filterKey].includes(item)) {
              draft[filterKey] = draft[filterKey].filter(
                (value) => value !== item,
              );
            } else {
              draft[filterKey].push(item);
            }
          }
          else{
            draft[filterKey] = [item];
          }
        });
      }}
      style={{
        ...(filters[filterKey].includes(item) && {
          borderColor: tailwind.theme.borderColor.brand[1].default,
        }),
      }}
    >
      <Text className={"body-b1-strong text-neutral-10-default"}>{item}</Text>
    </Button>
  );
};
