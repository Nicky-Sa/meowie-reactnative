import { View } from "react-native";
import { EnlargeableImage } from "@/features/general/enlargeable-image";
import { Genre } from "@/features/general/data/constants/useGenres";
import { PosterProps } from "@/features/common/data/models/poster";
import { MediaType } from "@/features/common/data/models/media-type";
import { TrailerPlayer } from "@/features/media/components/common/trailer-player";
import { GradientOverlay } from "@/features/common/ui/gradient-overlay";
import { ScrollableGenres } from "@/features/media/components/common/scrollable-genres";
import { RowInfo } from "@/features/media/components/common/row-info";
import { ScrollableTitle } from "@/features/media/components/common/scrollable-title";

type Props = {
  title: string;
  trailerKey: string;
  posterPath: string;
  posterProps: PosterProps;
  backdropPath: string;
  year: string;
  certification: string;
  duration: string;
  genres: Genre[];
  mediaType: MediaType;
  onPlay: () => void;
  onPause: () => void;
};

export const Hero = ({
  title,
  trailerKey,
  posterPath,
  posterProps,
  backdropPath,
  year,
  certification,
  duration,
  genres,
  mediaType,
  onPlay,
  onPause,
}: Props) => {
  return (
    <View className={"flex flex-col"}>
      {/* Trailer */}
      <View className={"h-64 flex-1 overflow-hidden"}>
        <TrailerPlayer
          YTKey={trailerKey}
          inScreen
          autoplay={false}
          onPlay={onPlay}
          onPause={onPause}
          fullWidth
          backdropPath={backdropPath}
        />
        {/* Dark gradient overlay */}
        <GradientOverlay
          height={120}
          colors={["transparent", "rgba(0,0,0,0.9)", "rgba(0,0,0,1)"]}
          positions={[0, 0.55, 1]}
          className={"absolute bottom-0"}
        />
      </View>

      <View className={"-mt-20 flex flex-1 flex-row gap-4 pl-4"}>
        <EnlargeableImage
          source={posterPath}
          blurhash={posterProps.blurhash}
          width={90}
        />
        <View className={"flex flex-1 flex-col justify-center gap-3"}>
          <View className={"gap-3"}>
            <ScrollableTitle title={title} />
            <RowInfo info={[year, certification, duration]} />
            <ScrollableGenres
              genres={genres}
              mediaType={mediaType}
              className={"-ml-1 grow-0"}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
