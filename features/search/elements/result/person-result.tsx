import { SearchResultPerson } from "@/features/search/data/models/search-result";
import { PersonBrief } from "@/features/person/brief";

type Props = {
  item: SearchResultPerson;
};

export const PersonResult = ({ item }: Props) => {
  return <PersonBrief data={item} isLoading={false} size={"md"} />;
};
