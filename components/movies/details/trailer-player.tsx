import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";
import { useAtom } from "jotai";
import { isYTPlayingAtom } from "@/atoms";
import { useAppState } from "@/hooks/useAppState";
import NoTrailer from "@/assets/images/no-trailer.svg";
import { tailwind } from "@/lib/utils";

type Props = {
  YTKey: string;
  shouldPlay: boolean;
};

export const TrailerPlayer = ({ YTKey, shouldPlay }: Props) => {
  const playerRef = useRef<YoutubeIframeRef>(null);

  const [canNotPlay, setCanNotPlay] = useState(false); // local state
  const [playing, setPlaying] = useState(false); // local state
  const [isYTPlaying] = useAtom(isYTPlayingAtom); // global state

  const { width: w } = useWindowDimensions();
  const width = w - 2.5 * Number(tailwind.theme.spacing[4]);

  const appState = useAppState();

  useEffect(() => {
    if (shouldPlay && appState === "active") {
      // Reset the video and play
      if (playerRef.current) {
        playerRef.current.seekTo(0, true); // Jump to the beginning (0 seconds)
      }
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, [shouldPlay, appState]);

  return canNotPlay ? (
    <View
      className={
        "flex h-[200px] w-full flex-col items-center justify-center gap-4 rounded-xl bg-neutral-10-default"
      }
    >
      <NoTrailer width="60" height="60" />
      <Text className={"body-b1 text-neutral-6-default"}>
        No trailer available!
      </Text>
    </View>
  ) : (
    <View
      className={
        "border-1.5 mx-auto flex h-[208px] w-full items-center justify-center rounded-xl border-neutral-3-default bg-black"
      }
    >
      <YoutubePlayer
        ref={playerRef}
        height={195}
        width={width}
        play={playing && isYTPlaying}
        volume={30}
        forceAndroidAutoplay
        initialPlayerParams={{
          controls: false,
          loop: true,
          preventFullScreen: true,
        }}
        videoId={YTKey}
        playList={[YTKey]}
        onError={() => setCanNotPlay(true)}
      />
    </View>
  );
};
