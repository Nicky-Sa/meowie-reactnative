import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect } from "react";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { Loading } from "@/features/common/ui/loading";
import { Divider } from "@/features/common/ui/divider";
import { ReleaseNoteCard } from "@/features/release-notes/release-note-card";
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
    ({ item, index }: { item: ReleaseNoteResDto; index: number }) => (
      <View>
        {index >= 2 && <Divider />}
        <ReleaseNoteCard note={item} highlighted={index === 0} />
      </View>
    ),
    [],
  );

  return (
    <InnerScreen title={"Release notes"} fullWidth>
      <FlashList
        data={data}
        keyExtractor={(note, index) => String(note.id) + index}
        renderItem={renderItem}
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
