import { useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import {
  YoutubeView,
  useYouTubePlayer,
  useYouTubeEvent,
  PlayerState,
} from "react-native-youtube-bridge";
import { useAtom } from "jotai";
import { allowYTPlayingAtom, ytMutedAtom } from "@/atoms";
import { VolumeManager } from "react-native-volume-manager";
import { useAppState } from "@/hooks/useAppState";
import NoTrailer from "@/assets/images/errors/no-trailer.svg";
import { cn, tailwind } from "@/lib/tailwind";
import { useScreenDimensions } from "@/hooks/useScreenDimensions";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";

type Props = {
  YTKey: string;
  inScreen: boolean;
  autoplay: boolean;
  onPlay: () => void;
  onPause: () => void;
  fullWidth?: boolean;
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
  fullWidth = false,
}: Props) => {
  return (
    <View className={"h-[200px] w-full"}>
      {inScreen ? (
        <Player
          key={YTKey}
          YTKey={YTKey}
          autoplay={autoplay}
          onPlay={onPlay}
          onPause={onPause}
          fullWidth={fullWidth}
        />
      ) : (
        <Loading fullWidth={fullWidth} />
      )}
    </View>
  );
};

const RETRY_ATTEMPTS = 1;

/**
 * The player itself.
 */
export const Player = ({
  YTKey,
  autoplay,
  onPlay,
  onPause,
  fullWidth,
}: Omit<Props, "inScreen">) => {
  const [ytMuted, setYtMuted] = useAtom(ytMutedAtom);
  const appState = useAppState();
  const [allowYTPlaying] = useAtom(allowYTPlayingAtom);

  const player = useYouTubePlayer(YTKey, {
    controls: false,
    loop: true,
    playsinline: true,
    muted: ytMuted,
    rel: false,
  });

  const [canNotPlay, setCanNotPlay] = useState(true); // true to prevent flicker
  const [isReady, setIsReady] = useState(false);
  const retryAttemptRef = useRef(0);
  const isFocused = useIsFocused();

  const shouldPlay =
    isReady && autoplay && allowYTPlaying && isFocused && appState === "active";

  // Handle external volume changes to unmute
  useEffect(() => {
    let initialVolume = -1;
    const volumeListener = VolumeManager.addVolumeListener((result) => {
      if (initialVolume === -1) {
        initialVolume = result.volume;
      }
      if (result.volume >= initialVolume) {
        setYtMuted(false);
      }
      initialVolume = result.volume;
    });

    return () => {
      volumeListener.remove();
    };
  }, [setYtMuted]);

  // Sync mute state to the player
  useEffect(() => {
    if (ytMuted) {
      player.mute();
    } else {
      player.unMute();
    }
  }, [ytMuted, player]);

  // Player events
  useYouTubeEvent(player, "ready", () => {
    setIsReady(true);
  });

  useYouTubeEvent(player, "stateChange", (state) => {
    if (state === PlayerState.PLAYING) {
      onPlay();
    } else if (state === PlayerState.PAUSED) {
      onPause();
    }
  });

  useYouTubeEvent(player, "error", () => {
    setCanNotPlay(true);
  });

  // Handle retries
  useEffect(() => {
    if (canNotPlay && retryAttemptRef.current < RETRY_ATTEMPTS) {
      setCanNotPlay(false);
      player.seekTo(0, true);
      retryAttemptRef.current += 1;
    }
  }, [canNotPlay, player]);

  // Play/pause based on shouldPlay state
  useEffect(() => {
    if (shouldPlay) {
      player.play();
    } else {
      player.pause();
    }
  }, [shouldPlay, player]);

  const { width: w } = useScreenDimensions();
  const width = fullWidth ? w : w - 2 * Number(tailwind.theme.spacing[4]); // * 2 for both side padding

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(isReady ? 1 : 0, { duration: 500 });
  }, [isReady, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <>
      {!isReady && <Loading fullWidth={fullWidth} />}
      <Animated.View
        style={animatedStyle}
        className={"flex h-full w-full items-center justify-center"}
      >
        {canNotPlay ? (
          <View
            className={cn(
              "flex h-full w-full flex-col items-center justify-center gap-3 bg-brand-10",
              !fullWidth && "rounded-xl",
            )}
          >
            <NoTrailer />
            <Text className={"body-b1 text-neutral-6-default"}>
              Failed to load the trailer.
            </Text>
          </View>
        ) : (
          <View
            style={{
              width: width,
              height: 200,
              overflow: "hidden",
              borderRadius: fullWidth
                ? 0
                : Number(tailwind.theme.borderRadius.xl),
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#000",
            }}
          >
            <View
              style={{
                width: width,
                height: 340,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <YoutubeView
                player={player}
                height={340}
                width={width}
                style={{
                  width: width,
                  height: 340,
                  transform: [{ scale: 1.3 }],
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
            </View>
          </View>
        )}
      </Animated.View>
    </>
  );
};

const Loading = ({ fullWidth = false }: Pick<Props, "fullWidth">) => {
  return (
    <SkeletonItem
      className={cn("absolute h-full w-full", fullWidth && "rounded-none")}
    />
  );
};
