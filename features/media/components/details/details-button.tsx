import { Button } from "@/features/common/ui/button";
import { NavArrowRight } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { MediaType } from "@/features/common/data/models/media-type";

type Props = {
  mediaType: MediaType;
};

export const DetailsButton = ({ mediaType }: Props) => {
  return (
    <Button
      variant={"ghost"}
      size={"md"}
      iconPosition={"right"}
      icon={<Icon i={NavArrowRight} />}
    >
      Details
    </Button>
  );
};
