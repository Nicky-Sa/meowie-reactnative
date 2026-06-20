import { SearchResultPerson } from "@/features/search/data/models/search-result";
import { PersonBrief } from "@/features/person/elements/brief";
import { Link } from "@/features/common/ui/link";

type Props = {
  item: SearchResultPerson;
  onPress?: () => void;
};

export const PersonCard = ({ item, onPress }: Props) => {
  return (
    <Link
      onPress={onPress}
      href={{
        pathname: "/person/[id]",
        params: { id: item.id.toString() },
      }}
    >
      <PersonBrief data={item} isLoading={false} size={"md"} />
    </Link>
  );
};
