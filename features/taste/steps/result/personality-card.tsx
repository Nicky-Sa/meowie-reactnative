import { Ref } from "react";
import { View } from "react-native";
import { ResolvedPersonality } from "@/features/taste/data/dto/taste.dto";
import { PersonalityPoster } from "@/features/taste/steps/result/personality-poster";
import { PersonalityHeadline } from "@/features/taste/steps/result/personality-headline";
import Logo from "@/assets/images/logo/logo.svg";
import LogoType from "@/assets/images/logo/logo-type.svg";

type Props = {
  personality: ResolvedPersonality;
  // The share snapshot is taken of this card. See use-share-card.
  ref?: Ref<View>;
};

export const PersonalityCard = ({ personality, ref }: Props) => (
  // The card's rounded corners are transparent and the snapshot has nothing
  // behind it, so an opaque mat takes them instead of white.
  <View
    ref={ref}
    collapsable={false}
    className={"max-h-full w-full bg-neutral-15-default p-4"}
  >
    <View
      className={
        "aspect-[3/5] max-h-full w-full overflow-hidden rounded-2xl border-2 border-neutral-2-default bg-neutral-15-default"
      }
    >
      {personality.poster ? (
        <PersonalityPoster poster={personality.poster} />
      ) : null}

      <PersonalityHeadline personality={personality} />

      <View
        className={
          "absolute inset-x-0 bottom-8 flex-row items-center justify-center gap-2"
        }
      >
        <Logo />
        <LogoType />
      </View>
    </View>
  </View>
);
