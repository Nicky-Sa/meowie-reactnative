import { Button } from "@/features/common/ui/button";
import { NavArrowRight } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { MediaType } from "@/features/common/data/models/media-type";
import { useRouter } from "expo-router";
import { ID } from "@/features/common/data/media-query";

type Props = {
  id: ID;
  mediaType: MediaType;
};

export const GoToDetails = ({ id, mediaType }: Props) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: `/discover/${mediaType}-details`,
      params: { [`${mediaType}Id`]: id },
    });
  };

  return (
    <Button
      variant={"link"}
      size={"md"}
      iconPosition={"right"}
      icon={<Icon i={NavArrowRight} />}
      onPress={handlePress}
      hitSlop={30}
      className={"-mr-1"}
    >
      Details
    </Button>
  );
};
