import { ShareIos } from "iconoir-react-native";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { Personality } from "@/features/taste/data/dto/taste.dto";
import { useCardImage } from "@/features/taste/hooks/use-card-image";
import { tailwind } from "@/lib/tailwind";

type Props = {
  personality: Personality;
};

export const ShareTypeButton = ({ personality }: Props) => {
  const { share, isSharing } = useCardImage(personality);

  return (
    <Button
      variant={"white"}
      size={"lg"}
      isLoading={isSharing}
      icon={
        <Icon
          i={ShareIos}
          color={tailwind.theme.textColor.neutral[1].default}
        />
      }
      onPress={share}
    >
      Share my type
    </Button>
  );
};
