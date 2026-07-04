import { View, Text } from "react-native";
import { cn } from "@/lib/tailwind";
import { ReleaseNoteResDto } from "@/features/release-notes/data/dto/release-notes.dto";
import { relativeTime } from "@/lib/utils/relative-time";

type Props = {
  note: ReleaseNoteResDto;
  // The newest note is shown on an elevated surface so it stands out.
  highlighted?: boolean;
};

export const ReleaseNoteCard = ({ note, highlighted = false }: Props) => {
  return (
    <View
      className={cn(
        "flex flex-col gap-4 p-4",
        highlighted && "bg-neutral-14-default",
      )}
    >
      <View className={"flex flex-row items-center gap-3"}>
        <View
          className={
            "h-12 w-12 items-center justify-center rounded-full bg-neutral-11-default"
          }
        >
          <Text className={"title-t2"}>{note.emoji}</Text>
        </View>
        <Text
          className={"title-t3-strong flex-1 text-neutral-10-default"}
          numberOfLines={2}
        >
          {note.title}
        </Text>
      </View>

      <Text className={"body-b1 text-neutral-6-default"}>
        {note.description}
      </Text>

      <View className={"flex flex-row items-center justify-between"}>
        <Text className={"body-b2 text-neutral-5-default"}>
          v{note.version}
        </Text>
        <Text className={"body-b2 text-neutral-5-default"}>
          {relativeTime(note.createdAt)}
        </Text>
      </View>
    </View>
  );
};
