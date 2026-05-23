import { SearchResultPerson } from "@/features/search/data/models/search-result";
import { PersonBrief } from "@/features/person/elements/brief";
import { Link } from "@/features/common/ui/link";

type Props = {
  item: SearchResultPerson;
};

export const PersonCard = ({ item }: Props) => {
  return (
    <Link
      href={{
        pathname: "/person/[id]",
        params: { id: item.id.toString() },
      }}
    >
      <PersonBrief data={item} isLoading={false} size={"md"} />
    </Link>
  );
};
