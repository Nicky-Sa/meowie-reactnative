import { useCallback, useEffect, useState, useRef, RefObject } from "react";
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
import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useFocusEffect } from "expo-router";

type Props = {
  YTKey: string;
  inScreen: boolean;
  autoplay: boolean;
  onPlay: () => void;
  onPause: () => void;
};

/**
 * The player wrapper.
 */

export const TrailerPlayer = ({
  YTKey,
  inScreen,
  autoplay,
  onPlay,
  onPause,
}: Props) => {
  return (
    <View className={"h-[200px] w-full"}>
      {inScreen ? (
        <Player
          YTKey={YTKey}
          autoplay={autoplay}
          onPlay={onPlay}
          onPause={onPause}
        />
      ) : (
        <Loading />
      )}
    </View>
  );
};

/**
 * The player itself.
 */

const RETRY_ATTEMPTS = 1;
export const Player = ({
  YTKey,
  autoplay,
  onPlay,
  onPause,
}: Omit<Props, "inScreen">) => {
  const playerRef = useRef<YoutubeIframeRef>(null);

  const { canNotPlay, handleError } = useLoad(playerRef);
  const { isReady, shouldPlay, handleReady } = usePlay(playerRef, autoplay);

  const handleStateChange = useCallback(
    (state: PLAYER_STATES) => {
      if (state === PLAYER_STATES.PLAYING) {
        onPlay();
      } else if (state === PLAYER_STATES.PAUSED) {
        onPause();
      }
    },
    [onPlay, onPause],
  );

  const { width: w } = useScreenDimensions();
  const width = w - 2 * Number(tailwind.theme.spacing[4]); // * 2 for both side padding

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(isReady ? 1 : 0, { duration: 500 });
  }, [isReady, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <>
      {!isReady && <Loading />}
      <Animated.View
        style={animatedStyle}
        className={"flex h-full w-full items-center justify-center"}
      >
        {canNotPlay ? (
          <View
            className={
              "flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl bg-brand-10"
            }
          >
            <NoTrailer />
            <Text className={"body-b1 text-neutral-6-default"}>
              Failed to load the trailer.
            </Text>
          </View>
        ) : (
          <YoutubePlayer
            ref={playerRef}
            height={200}
            width={width}
            play={shouldPlay}
            onReady={handleReady}
            onChangeState={handleStateChange}
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
            webViewStyle={{
              borderRadius: Number(tailwind.theme.borderRadius.xl),
            }}
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
        )}
      </Animated.View>
    </>
  );
};

const Loading = () => {
  return <SkeletonItem className={"absolute h-full w-full"} />;
};

const useLoad = (playerRef: RefObject<YoutubeIframeRef | null>) => {
  const retryAttemptRef = useRef(0);
  const [canNotPlay, setCanNotPlay] = useState(true); // true to prevent flicker

  const handleReload = useCallback(() => {
    setCanNotPlay(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0, true);
    }
  }, [playerRef]);

  const handleError = useCallback(() => {
    setCanNotPlay(true);
  }, []);

  useEffect(() => {
    if (canNotPlay && retryAttemptRef.current < RETRY_ATTEMPTS) {
      handleReload();
      retryAttemptRef.current += 1;
    }
  }, [canNotPlay, handleReload]);

  return { canNotPlay, handleError, playerRef };
};

const usePlay = (
  playerRef: RefObject<YoutubeIframeRef | null>,
  autoplay: boolean,
) => {
  const appState = useAppState();
  const [allowYTPlaying] = useAtom(allowYTPlayingAtom);
  const [isReady, setIsReady] = useState(false);
  const shouldPlay =
    isReady && autoplay && allowYTPlaying && appState === "active";

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (shouldPlay) {
        playerRef.current?.getCurrentTime().then((time) => {
          playerRef.current?.seekTo(time, true);
        });
      }
    }, [playerRef, shouldPlay]),
  );

  return { isReady, shouldPlay, handleReady };
};
