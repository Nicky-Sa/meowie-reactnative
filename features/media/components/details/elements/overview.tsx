import { Text } from "react-native";

type Props = {
  overview: string;
};

export const Overview = ({ overview }: Props) => {
  return <Text className="body-b2 text-neutral-6-default">{overview}</Text>;
};
