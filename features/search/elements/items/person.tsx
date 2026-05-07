import { SearchResultPerson } from "@/features/search/data/models/search-result";
import { PersonBrief } from "@/features/person/elements/brief";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

type Props = {
  item: SearchResultPerson;
};

export const PersonCard = ({ item }: Props) => {
  const router = useRouter();
  const onPress = () => {
    router.push({
      pathname: "/person/[id]",
      params: { id: item.id.toString() },
    });
  };

  return (
    <Pressable onPress={onPress}>
      <PersonBrief data={item} isLoading={false} size={"md"} />
    </Pressable>
  );
};
