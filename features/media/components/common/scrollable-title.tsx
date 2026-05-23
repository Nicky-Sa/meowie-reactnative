import { ScrollView, Text } from "react-native";
import { Href } from "expo-router";
import { Link } from "@/features/common/ui/link";

type Props = {
  title: string;
  href?: Href;
};

export const ScrollableTitle = ({ title, href }: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={"-mx-2 grow-0"}
      contentContainerClassName={"min-w-full"}
    >
      {href ? (
        <Link href={href}>
          <Content title={title} />
        </Link>
      ) : (
        <Content title={title} />
      )}
    </ScrollView>
  );
};

const Content = ({ title }: Pick<Props, "title">) => {
  return (
    <Text className={"title-t1-strong px-2 text-neutral-10-default"}>
      {title}
    </Text>
  );
};
