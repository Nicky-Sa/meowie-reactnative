import { useCallback, useEffect, useState, useRef } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";
import { useAtom } from "jotai";
import { allowYTPlayingAtom } from "@/atoms";
import { useAppState } from "@/hooks/useAppState";
import NoTrailer from "@/assets/images/no-trailer.svg";
import { tailwind } from "@/lib/utils";
import Restart from "@/assets/icons/restart.svg";
import { Button } from "@/components/common/button";

type Props = {
  YTKey: string;
  shouldPlay: boolean;
};

const RETRY_ATTEMPTS = 1;

export const TrailerPlayer = ({ YTKey, shouldPlay }: Props) => {
  const playerRef = useRef<YoutubeIframeRef>(null);
  const retryAttemptRef = useRef(0);

  const [canNotPlay, setCanNotPlay] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [allowYTPlaying] = useAtom(allowYTPlayingAtom);

  const { width: w } = useWindowDimensions();
  const width = w - 2.5 * Number(tailwind.theme.spacing[4]);

  const appState = useAppState();

  const handleReload = useCallback(() => {
    setCanNotPlay(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0, true);
      setPlaying(true);
    }
  }, []);

  const handleError = useCallback(() => {
    setCanNotPlay(true);
  }, []);

  useEffect(() => {
    if (canNotPlay && retryAttemptRef.current < RETRY_ATTEMPTS) {
      handleReload();
      retryAttemptRef.current += 1;
    }
  }, [canNotPlay, handleReload]);

  useEffect(() => {
    if (shouldPlay && appState === "active") {
      if (playerRef.current) {
        playerRef.current.seekTo(0, true);
      }
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, [shouldPlay, appState]);

  return canNotPlay ? (
    <View
      className={
        "flex h-[208px] w-full flex-col items-center justify-center gap-3 rounded-xl bg-neutral-10-default"
      }
    >
      <NoTrailer width="60" height="60" />
      <Text className={"body-b1 text-neutral-6-default"}>
        Failed to load the trailer
      </Text>
      <Button
        onPress={handleReload}
        variant={"secondary"}
        size={"md"}
        iconPosition={"left"}
      >
        <View className={"flex flex-row items-center justify-center gap-2"}>
          <Restart />
          <Text className={"body-b1-strong text-neutral-10-default"}>
            Reload
          </Text>
        </View>
      </Button>
    </View>
  ) : (
    <View
      className={
        "mx-auto flex h-[208px] w-full items-center justify-center rounded-xl border-1.5 border-neutral-3-default bg-black"
      }
    >
      <YoutubePlayer
        ref={playerRef}
        height={195}
        width={width}
        play={playing && allowYTPlaying}
        volume={30}
        forceAndroidAutoplay
        initialPlayerParams={{
          controls: false,
          loop: true,
          preventFullScreen: true,
        }}
        videoId={YTKey}
        playList={[YTKey]}
        onError={handleError}
        webViewProps={{
          injectedJavaScript: `
            var element = document.getElementsByClassName('container')[0];
            element.style.position = 'unset';
            true;
          `,
        }}
      />
    </View>
  );
};
