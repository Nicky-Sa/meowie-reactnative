import { ComponentType } from "react";
import NoMatch from "@/assets/images/errors/no-match.svg";
import { InformationBlock } from "@/features/common/information-block";

type Props = {
  img?: ComponentType;
  text?: string;
};

export const EmptyState = ({
  img = NoMatch,
  text = "No data to show.",
}: Props) => {
  return <InformationBlock img={img} text={text} />;
};
