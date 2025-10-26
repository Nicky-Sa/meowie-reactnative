import { Text } from "react-native";

type Props = {
  text: string;
  numberOfLines: number;
};

// TODO: implement more button
export const TextMore = ({ text, numberOfLines }: Props) => {
  return <Text className={"body-b1 text-neutral-5-default"}>{text}</Text>;
};
