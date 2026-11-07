import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import { ReleaseNoteMediaType } from "@/features/release-notes/data/dto/release-notes.dto";

const squareStyle = { width: "100%", aspectRatio: 1 } as const;

type VideoProps = {
  url: string;
};

const ReleaseNotesVideo = ({ url }: VideoProps) => {
  const player = useVideoPlayer(url, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
    videoPlayer.play();
  });

  return (
    <VideoView
      player={player}
      nativeControls={false}
      contentFit={"cover"}
      style={squareStyle}
    />
  );
};

type Props = {
  url: string;
  type: ReleaseNoteMediaType;
};

export const ReleaseNoteMedia = ({ url, type }: Props) => {
  switch (type) {
    case "image":
      return <Image source={url} contentFit={"cover"} style={squareStyle} />;
    case "video":
      return <ReleaseNotesVideo url={url} />;
  }
};
