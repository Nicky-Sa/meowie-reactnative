import { View, Text } from "react-native";
import { ReleaseNoteResDto } from "@/features/release-notes/data/dto/release-notes.dto";
import { relativeTime } from "@/lib/utils/relative-time";
import { ReleaseNoteMedia } from "@/features/release-notes/media";

type Props = {
  note: ReleaseNoteResDto;
};

export const ReleaseNotesCard = ({ note }: Props) => {
  return (
    <View
      className={
        "flex flex-col overflow-hidden rounded-3xl bg-neutral-14-default"
      }
    >
      {note.mediaUrl && note.mediaType ? (
        <ReleaseNoteMedia url={note.mediaUrl} type={note.mediaType} />
      ) : null}

      <View className={"flex flex-col gap-4 p-4"}>
        <Text className={"title-t3-strong text-neutral-10-default"}>
          {note.title}
        </Text>

        <View className={"flex flex-col gap-2"}>
          {note.points.map((point) => (
            <View key={point} className={"flex flex-row gap-2"}>
              <View className={"py-2"}>
                <View
                  className={"size-1.5 rounded-full bg-neutral-6-default"}
                />
              </View>
              <Text className={"body-b1 flex-1 text-neutral-6-default"}>
                {point}
              </Text>
            </View>
          ))}
        </View>

        <View className={"flex flex-row items-center justify-between px-1"}>
          <Text className={"body-b2 text-neutral-5-default"}>
            {`v${note.version}`}
          </Text>
          <Text className={"body-b2 text-neutral-5-default"}>
            {relativeTime(note.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );
};
