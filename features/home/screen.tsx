import { MainScreen } from "@/features/common/layout/main-screen";
import { Header } from "@/features/home/header";
import { useScrollHandler } from "@/features/common/hooks/list/useScrollHandler";
import { Content as MoviesContent } from "@/features/media/movie/content";
import { Content as TvContent } from "@/features/media/tv/content";
import { SlidingContent } from "@/features/common/ui/sliding-content";
import { MEDIA_TYPES } from "@/features/common/data/models/media-type";
import { useState } from "react";

const mediaTypes = MEDIA_TYPES.map((m) => m.label);

export const Screen = () => {
  const { scrollHandler, scrollY, currentIndex, resetScroll } =
    useScrollHandler();
  const [activeMediaType, setActiveMediaType] = useState(mediaTypes[0]);

  const handleMediaTypeChange = (type: string) => {
    resetScroll();
    setActiveMediaType(type);
  };

  return (
    <MainScreen>
      <Header
        scrollY={scrollY}
        mediaTypes={mediaTypes}
        activeMediaType={activeMediaType}
        setActiveMediaType={handleMediaTypeChange}
      />

      <SlidingContent
        isActive={activeMediaType === mediaTypes[0]}
        slideDirection="left"
        className={"flex-1"}
      >
        <MoviesContent
          isActive={activeMediaType === mediaTypes[0]}
          currentIndex={currentIndex}
          scrollY={scrollY}
          scrollHandler={scrollHandler}
        />
      </SlidingContent>

      <SlidingContent
        isActive={activeMediaType === mediaTypes[1]}
        slideDirection="right"
        className={"flex-1"}
      >
        <TvContent
          isActive={activeMediaType === mediaTypes[1]}
          currentIndex={currentIndex}
          scrollY={scrollY}
          scrollHandler={scrollHandler}
        />
      </SlidingContent>
    </MainScreen>
  );
};
