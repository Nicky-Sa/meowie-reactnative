import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { View, Pressable, Text } from "react-native";
import Icon from "@expo/vector-icons/Feather";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { isMuteAtom, isYTPlayingAtom } from "@/atoms";
import { useAppState } from "@/hooks/useAppState";
import NoTrailer from "@/assets/images/no-trailer.svg";

type Props = {
  YTKey: string;
  shouldPlay: boolean;
};

export const TrailerPlayer = ({ YTKey, shouldPlay }: Props) => {
  const playerRef = useRef<YoutubeIframeRef>(null);
  const [isReady, setIsReady] = useState(false);

  const [canNotPaly, setCanNotPaly] = useState(false);
  const [playing, setPlaying] = useState(false); // local state
  const [isYTPlaying] = useAtom(isYTPlayingAtom); // global state
  const [mute, setMute] = useAtom(isMuteAtom);
  const [startFade, setStartFade] = useState(false);
  const isFirstLoad = useRef(true);

  const appState = useAppState();

  useEffect(() => {
    if (isFirstLoad.current) {
      // Skip the effect on the first load
      isFirstLoad.current = false;
      return;
    }
    setStartFade(true);
    const timeout = setTimeout(() => {
      setStartFade(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [mute]);

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

  return canNotPaly ? (
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
    <Pressable
      className={cn(
        "relative min-h-fit w-full",
        !isReady ? "animate-pulse bg-neutral-12-default" : "bg-transparent",
      )}
      onPress={() => setMute((prev) => !prev)}
    >
      <View
        className={cn(
          "absolute right-0 top-0 z-10 flex h-full w-full items-center justify-center",
        )}
      >
        <Icon
          className={cn(
            startFade ? "opacity-100" : "opacity-0",
            "bg-neutral-12-default/70 rounded-full p-3 transition-all duration-200",
          )}
          name={mute ? "volume-x" : "volume-2"}
          size={32}
          color="white"
        />
      </View>
      <View pointerEvents={"none"}>
        <YoutubePlayer
          ref={playerRef}
          height={195}
          play={playing && isYTPlaying}
          volume={30}
          mute={mute}
          forceAndroidAutoplay
          initialPlayerParams={{ controls: false, loop: true }}
          videoId={YTKey}
          playList={[YTKey]}
          onReady={() => setIsReady(true)}
          onError={() => setCanNotPaly(true)}
        />
      </View>
    </Pressable>
  );
};
