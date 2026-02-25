import { MainScreen } from "@/features/common/layout/main-screen";
import { Header } from "@/features/home/header";
import { useScrollHandler } from "@/features/common/hooks/list/useScrollHandler";
import { Content as MoviesContent } from "@/features/media/movie/content";
import { Content as TvContent } from "@/features/media/tv/content";
import { useEffect, useState } from "react";
import Animated, {
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { MEDIA_TYPES } from "@/features/common/data/models/media-type";

const mediaTypes = MEDIA_TYPES.map((m) => m.label);

export const Screen = () => {
  const { scrollHandler, scrollY, currentIndex, onLoad } = useScrollHandler();
  const [activeMediaType, setActiveMediaType] = useState(mediaTypes[0]);

  useEffect(() => {
    // Reset scroll position so the new list starts at the top
    scrollY.value = 0;
  }, [activeMediaType, scrollY]);

  return (
    <MainScreen>
      <Header
        scrollY={scrollY}
        mediaTypes={mediaTypes}
        activeMediaType={activeMediaType}
        setActiveMediaType={setActiveMediaType}
      />

      {activeMediaType === mediaTypes[0] && (
        <Animated.View
          entering={SlideInLeft.duration(300)}
          exiting={SlideOutLeft.duration(300)}
          className={"flex-1"}
        >
          <MoviesContent
            currentIndex={currentIndex}
            scrollY={scrollY}
            scrollHandler={scrollHandler}
            onLoad={onLoad}
          />
        </Animated.View>
      )}

      {activeMediaType === mediaTypes[1] && (
        <Animated.View
          entering={SlideInRight.duration(300)}
          exiting={SlideOutRight.duration(300)}
          className={"flex-1"}
        >
          <TvContent
            currentIndex={currentIndex}
            scrollY={scrollY}
            scrollHandler={scrollHandler}
            onLoad={onLoad}
          />
        </Animated.View>
      )}
    </MainScreen>
  );
};
