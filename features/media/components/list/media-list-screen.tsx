import { MediaList } from "@/features/media/components/list/media-list";
import { Header } from "@/features/media/components/header";
import { MainScreen } from "@/features/common/layout/main-screen";
import { ReactElement, ReactNode, useMemo } from "react";
import { PosterHookResult } from "@/features/common/posters/types";
import { useScrollHandler } from "@/features/common/hooks/list/use-scroll-handler";
import { MediaListItemData } from "@/features/media/components/list/types";

type Props = {
  title: string;
  posterData: PosterHookResult;
  initialIndex?: number;
  subtitle?: string;
  ListEmptyComponent?: ReactElement;
  rightTopComponent?: ReactNode;
};

export const MediaListScreen = ({
  title,
  posterData,
  initialIndex,
  subtitle,
  ListEmptyComponent,
  rightTopComponent,
}: Props) => {
  const {
    data: rawPosterData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = posterData;

  const data: MediaListItemData[] = useMemo(() => {
    return (
      rawPosterData?.map((item) => ({
        id: item.id,
        mediaType: item.mediaType,
        roleInMedia: item.role,
      })) || []
    );
  }, [rawPosterData]);

  const { scrollHandler, scrollY, isDragging, currentIndex } =
    useScrollHandler();

  return (
    <MainScreen>
      <Header
        title={title}
        subtitle={subtitle}
        rightTopComponent={rightTopComponent}
      />
      <MediaList
        data={data}
        isLoading={isLoading}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        error={error}
        refetch={refetch}
        initialScrollIndex={initialIndex}
        scrollHandler={scrollHandler}
        scrollY={scrollY}
        isDragging={isDragging}
        currentIndex={currentIndex}
        ListEmptyComponent={ListEmptyComponent}
      />
    </MainScreen>
  );
};
