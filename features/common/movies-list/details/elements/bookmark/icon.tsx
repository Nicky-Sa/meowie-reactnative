import LottieView from "lottie-react-native";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export type BookmarkIconHandle = {
  bookmark: () => void;
  unbookmark: () => void;
};

type Props = {
  isBookmarked: boolean;
};

const BOOKMARKED_END_FRAME = 75;
const UNBOOKMARKED_START_FRAME = 100;
const UNBOOKMARKED_END_FRAME = 160;

export const BookmarkIcon = forwardRef<BookmarkIconHandle, Props>(
  ({ isBookmarked }, ref) => {
    const lottieRef = useRef<LottieView>(null);

    const determineInitialAnimation = useCallback(() => {
      if (isBookmarked) {
        // Play from end frame to end frame to "snap" instantly
        lottieRef.current?.play(BOOKMARKED_END_FRAME, BOOKMARKED_END_FRAME);
      } else {
        lottieRef.current?.play(UNBOOKMARKED_END_FRAME, UNBOOKMARKED_END_FRAME);
      }
    }, [isBookmarked]);

    useImperativeHandle(ref, () => ({
      bookmark: () => {
        lottieRef.current?.play(0, BOOKMARKED_END_FRAME);
      },
      unbookmark: () => {
        lottieRef.current?.play(
          UNBOOKMARKED_START_FRAME,
          UNBOOKMARKED_END_FRAME,
        );
      },
    }));

    return (
      <LottieView
        ref={lottieRef}
        source={{
          uri: "https://meowie-public.s3.eu-central-1.amazonaws.com/bookmark-lottie.json",
        }}
        resizeMode={"cover"}
        loop={false}
        autoPlay={false}
        onLayout={determineInitialAnimation} // for the rest of the items
        onAnimationLoaded={determineInitialAnimation} // for the first item of the list
        style={{
          width: 24,
          height: 24,
        }}
      />
    );
  },
);

BookmarkIcon.displayName = "BookmarkIcon";
