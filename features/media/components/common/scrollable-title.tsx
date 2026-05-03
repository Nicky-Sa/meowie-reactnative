import { ScrollView, Text } from "react-native";

type Props = {
  title: string;
};

export const ScrollableTitle = ({ title }: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={"-mx-2 grow-0"}
      contentContainerClassName={"min-w-full"}
    >
      <Text className={"title-t1-strong px-2 text-neutral-10-default"}>
        {title}
      </Text>
    </ScrollView>
  );
};
