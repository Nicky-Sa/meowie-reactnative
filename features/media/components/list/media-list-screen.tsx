import { MediaList } from "@/features/media/components/list/media-list";
import { Header } from "@/features/media/components/header";
import { MainScreen } from "@/features/common/layout/main-screen";
import { ReactNode } from "react";
import { PosterHookResult } from "@/features/common/posters/types";
import { useScrollHandler } from "@/features/common/hooks/list/useScrollHandler";
import { MediaListItemData } from "@/features/media/components/list/types";

type Props = {
  title: string;
  initialIndex?: number;
  subtitle?: string;
  subtitleIsLoading?: boolean;
  posterData: PosterHookResult;
  rightTopComponent?: ReactNode;
};

export const MediaListScreen = ({
  title,
  initialIndex,
  subtitle,
  subtitleIsLoading,
  posterData,
  rightTopComponent,
}: Props) => {
  const {
    data: rawPosterData,
    dataLength,
    size,
    setSize,
    totalPages,
    isLoading,
    isValidating,
    error,
    mutate,
  } = posterData;

  const data: MediaListItemData[] =
    rawPosterData?.map((item) => ({
      id: item.id,
      mediaType: item.mediaType,
    })) || [];
  const { scrollHandler, scrollY, currentIndex, onLoad } = useScrollHandler();

  return (
    <MainScreen>
      <Header
        title={title}
        subtitle={subtitle}
        subtitleIsLoading={subtitleIsLoading}
        rightTopComponent={rightTopComponent}
      />
      <MediaList
        data={data}
        dataLength={dataLength}
        isLoading={isLoading}
        isValidating={isValidating}
        size={size}
        setSize={setSize}
        totalPages={totalPages}
        error={error}
        mutate={mutate}
        initialScrollIndex={initialIndex}
        scrollHandler={scrollHandler}
        scrollY={scrollY}
        currentIndex={currentIndex}
        onLoad={onLoad}
      />
    </MainScreen>
  );
};
