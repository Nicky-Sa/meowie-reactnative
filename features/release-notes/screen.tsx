import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect } from "react";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { Loading } from "@/features/common/ui/loading";
import { ReleaseNotesCard } from "@/features/release-notes/card";
import { useFetchReleaseNotes } from "@/features/release-notes/data/use-fetch-release-notes";
import { useMarkReleaseNotesSeen } from "@/features/release-notes/data/use-mark-release-notes-seen";
import { ReleaseNoteResDto } from "@/features/release-notes/data/dto/release-notes.dto";
import { EmptyState } from "@/features/general/empty-state";

export const Screen = () => {
  const { data, isLoading } = useFetchReleaseNotes();
  const markSeen = useMarkReleaseNotesSeen();

  // Opening the screen clears the "new" badge on the logo.
  useEffect(() => {
    markSeen(data);
  }, [data, markSeen]);

  const renderItem = useCallback(
    ({ item }: { item: ReleaseNoteResDto }) => <ReleaseNotesCard note={item} />,
    [],
  );

  return (
    <InnerScreen title={"Release notes"} fullHeight>
      <FlashList
        data={data}
        contentInsetAdjustmentBehavior={"automatic"}
        keyExtractor={(note, index) => String(note.id) + index}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className={"h-6"} />}
        contentContainerClassName={"grow"}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? (
            <View className={"flex-1 items-center justify-center"}>
              <Loading />
            </View>
          ) : (
            EmptyState
          )
        }
      />
    </InnerScreen>
  );
};
