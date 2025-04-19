import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";
import { useAtom } from "jotai";
import { isYTPlayingAtom } from "@/atoms";
import { useAppState } from "@/hooks/useAppState";
import NoTrailer from "@/assets/images/no-trailer.svg";

type Props = {
  YTKey: string;
  shouldPlay: boolean;
};

export const TrailerPlayer = ({ YTKey, shouldPlay }: Props) => {
  const playerRef = useRef<YoutubeIframeRef>(null);

  const [canNotPlay, setCanNotPlay] = useState(false); // local state
  const [playing, setPlaying] = useState(false); // local state
  const [isYTPlaying] = useAtom(isYTPlayingAtom); // global state

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
        "flex h-[195px] flex-col items-center justify-center gap-4 bg-neutral-10-default"
      }
    >
      <NoTrailer width="60" height="60" />
      <Text className={"body-b1 text-neutral-6-default"}>
        No trailer available!
      </Text>
    </View>
  ) : (
    <YoutubePlayer
      ref={playerRef}
      height={190}
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
  );
};
