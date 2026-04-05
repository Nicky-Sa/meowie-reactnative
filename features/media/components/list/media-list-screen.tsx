import { MediaList } from "@/features/media/components/list/media-list";
import { Header } from "@/features/media/components/header";
import { MainScreen } from "@/features/common/layout/main-screen";
import { ReactElement, ReactNode } from "react";
import { PosterHookResult } from "@/features/common/posters/types";
import { useScrollHandler } from "@/features/common/hooks/list/useScrollHandler";
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
    dataLength,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = posterData;

  const data: MediaListItemData[] =
    rawPosterData?.map((item) => ({
      id: item.id,
      mediaType: item.mediaType,
      roleInMedia: item.role,
    })) || [];
  const { scrollHandler, scrollY, currentIndex } = useScrollHandler();

  return (
    <MainScreen>
      <Header
        title={title}
        subtitle={subtitle}
        rightTopComponent={rightTopComponent}
      />
      <MediaList
        data={data}
        dataLength={dataLength}
        isLoading={isLoading}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        error={error}
        refetch={refetch}
        initialScrollIndex={initialIndex}
        scrollHandler={scrollHandler}
        scrollY={scrollY}
        currentIndex={currentIndex}
        ListEmptyComponent={ListEmptyComponent}
      />
    </MainScreen>
  );
};
