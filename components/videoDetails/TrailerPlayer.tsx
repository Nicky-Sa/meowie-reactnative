import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import Icon from "@expo/vector-icons/Feather";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { isMuteAtom } from "@/atoms";

type Props = {
  YTKey: string;
  shouldPlay: boolean;
};

export const TrailerPlayer = ({ YTKey, shouldPlay }: Props) => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<YoutubeIframeRef>(null);

  const [mute, setMute] = useAtom(isMuteAtom);
  const [startFade, setStartFade] = useState(false);
  const isFirstLoad = useRef(true);

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
    if (shouldPlay) {
      // Reset the video and play
      if (playerRef.current) {
        playerRef.current.seekTo(0, true); // Jump to the beginning (0 seconds)
      }
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, [shouldPlay]);

  return (
    <Pressable
      className={"relative mt-4 w-full rounded-xl"}
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
            "rounded-full bg-black/70 p-3 transition-all duration-200",
          )}
          name={mute ? "volume-x" : "volume-2"}
          size={32}
          color="white"
        />
      </View>
      <View pointerEvents={"none"}>
        <YoutubePlayer
          ref={playerRef}
          webViewStyle={{ borderRadius: 12 }}
          height={200}
          play={playing}
          volume={30}
          mute={mute}
          forceAndroidAutoplay
          initialPlayerParams={{ controls: false, loop: true }}
          videoId={YTKey}
          playList={[YTKey]}
        />
      </View>
    </Pressable>
  );
};
