import { useCallback, useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";
import { useAtom } from "jotai";
import { allowYTPlayingAtom } from "@/atoms";
import { useAppState } from "@/hooks/useAppState";
import NoTrailer from "@/assets/images/errors/no-trailer.svg";
import { tailwind } from "@/lib/tailwind";
import { useScreenDimensions } from "@/hooks/useScreenDimensions";

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

  const { width: w } = useScreenDimensions();
  const width = w - 2.5 * Number(tailwind.theme.spacing[4]); // * 2 for both side padding

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
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, [shouldPlay, appState]);

  useEffect(() => {
    if (!shouldPlay) {
      if (playerRef.current) {
        playerRef.current.seekTo(0, true);
      }
    }
  }, [shouldPlay]);

  return canNotPlay ? (
    <View
      className={
        "flex h-[208px] w-full flex-col items-center justify-center gap-3 rounded-xl bg-neutral-10-default"
      }
    >
      <NoTrailer />
      <Text className={"body-b1 text-neutral-6-default"}>
        Failed to load the trailer.
      </Text>
    </View>
  ) : (
    <View
      className={
        "border-neutral-13-default mx-auto flex h-[208px] w-full items-center justify-center rounded-xl border-1.5 bg-black"
      }
    >
      <YoutubePlayer
        ref={playerRef}
        height={200}
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
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            var container = document.getElementsByClassName('container')[0];
            if (container) {
              container.style.overflow = 'hidden';
              container.style.position = 'unset';
            }
            true;
          `,
        }}
      />
    </View>
  );
};
