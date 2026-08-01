import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import {
  PosterDeck,
  PosterDeckHandle,
} from "@/features/taste/elements/poster-deck";
import { RatingButtons } from "@/features/taste/elements/rating-buttons";
import { Title } from "@/features/taste/data/dto/journey.dto";
import { TitleAnswer, TitleRatings } from "@/features/taste/data/dto/taste.dto";

type Props = {
  items: Title[];
  ratings: TitleRatings;
  onRate: (tmdbId: number, answer: TitleAnswer) => void;
};

// Long enough to read the button as picked, short enough not to feel stuck.
const PAUSE_AFTER_RATING = 250;

/** The deck plus its three buttons — the shared body of the movies and series steps. */
export const RatingStep = ({ items, ratings, onRate }: Props) => {
  const deck = useRef<PosterDeckHandle>(null);
  const [shownIndex, setShownIndex] = useState(0);
  const [isMovingOn, setIsMovingOn] = useState(false);
  const shown = items[shownIndex];

  // Holds on the poster so the picked button is visible before the deck moves.
  // The cleanup drops the wait whether it fires, is beaten, or the step closes.
  useEffect(() => {
    if (!isMovingOn) return;

    const timer = setTimeout(() => {
      setIsMovingOn(false);
      deck.current?.showNext();
    }, PAUSE_AFTER_RATING);

    return () => clearTimeout(timer);
  }, [isMovingOn]);

  const rate = (answer: TitleAnswer) => {
    if (!shown) return;
    onRate(shown.tmdbId, answer);
    setIsMovingOn(true);
  };

  // A hand flick beats the wait, so drop it rather than move a second time.
  const showCard = (index: number) => {
    setIsMovingOn(false);
    setShownIndex(index);
  };

  return (
    <View className={"flex flex-1 flex-col gap-4"}>
      <PosterDeck ref={deck} items={items} onShow={showCard} />
      <RatingButtons answer={shown && ratings[shown.tmdbId]} onRate={rate} />
    </View>
  );
};
