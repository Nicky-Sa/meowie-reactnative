import { useCallback, useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import YoutubePlayer, {
  PLAYER_STATES,
  YoutubeIframeRef,
} from "react-native-youtube-iframe";
import { useAtom } from "jotai";
import { allowYTPlayingAtom } from "@/atoms";
import { useAppState } from "@/hooks/useAppState";
import NoTrailer from "@/assets/images/errors/no-trailer.svg";
import { tailwind } from "@/lib/tailwind";
import { useScreenDimensions } from "@/hooks/useScreenDimensions";
import { useIsFocused } from "@react-navigation/native";

type Props = {
  YTKey: string;
  inScreen: boolean;
  autoplay: boolean;
  onPlay: () => void;
  onPause: () => void;
};

const RETRY_ATTEMPTS = 1;

export const TrailerPlayer = ({
  YTKey,
  inScreen,
  autoplay,
  onPlay,
  onPause,
}: Props) => {
  const playerRef = useRef<YoutubeIframeRef>(null);
  const retryAttemptRef = useRef(0);
  const isFocused = useIsFocused(); // checks if the player is present on the current screen

  const appState = useAppState();
  const [canNotPlay, setCanNotPlay] = useState(false);
  const [allowYTPlaying] = useAtom(allowYTPlayingAtom);

  const { width: w } = useScreenDimensions();
  const width = w - 2.5 * Number(tailwind.theme.spacing[4]); // * 2 for both side padding

  const handleReload = useCallback(() => {
    setCanNotPlay(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0, true);
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

  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (inScreen && appState === "active" && allowYTPlaying && isFocused) {
      setPlay(autoplay);
      if (autoplay && playerRef.current) {
        playerRef.current.seekTo(0, true);
      }
    } else {
      setPlay(false);
    }
  }, [allowYTPlaying, appState, autoplay, inScreen, isFocused]);

  const handleStateChange = useCallback(
    (state: PLAYER_STATES) => {
      if (state === PLAYER_STATES.PLAYING) {
        setPlay(true);
        onPlay();
      }
      if (state === PLAYER_STATES.PAUSED) {
        onPause();
      }
    },
    [onPause],
  );

  return canNotPlay ? (
    <View
      className={
        "flex h-[208px] w-full flex-col items-center justify-center gap-3 rounded-xl bg-brand-10"
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
        play={play}
        onChangeState={handleStateChange}
        volume={30}
        forceAndroidAutoplay
        initialPlayerParams={{
          start: 0,
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
