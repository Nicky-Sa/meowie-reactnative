import { MainScreen } from "@/features/common/layout/main-screen";
import { Header } from "@/features/home/header";
import { useScrollHandler } from "@/features/common/hooks/list/useScrollHandler";
import { Content as MoviesContent } from "@/features/media/movie/content";
import { Content as TvContent } from "@/features/media/tv/content";
import { useEffect, useState } from "react";
import { SlidingContent } from "@/features/common/ui/sliding-content";
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

      <SlidingContent
        isActive={activeMediaType === mediaTypes[0]}
        slideDirection="left"
        className={"flex-1"}
      >
        <MoviesContent
          currentIndex={currentIndex}
          scrollY={scrollY}
          scrollHandler={scrollHandler}
          onLoad={onLoad}
        />
      </SlidingContent>

      <SlidingContent
        isActive={activeMediaType === mediaTypes[1]}
        slideDirection="right"
        className={"flex-1"}
      >
        <TvContent
          currentIndex={currentIndex}
          scrollY={scrollY}
          scrollHandler={scrollHandler}
          onLoad={onLoad}
        />
      </SlidingContent>
    </MainScreen>
  );
};
