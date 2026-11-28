import { useCallback, useEffect, useState } from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import {
  YoutubeView,
  useYouTubePlayer,
  useYouTubeEvent,
  PlayerState,
} from "react-native-youtube-bridge";
import { useAtom } from "jotai";
import { allowYTPlayingAtom, ytMutedAtom } from "@/atoms";
import { VolumeManager } from "react-native-volume-manager";
import { useAppState } from "@/hooks/use-app-state";
import { cn, tailwind } from "@/lib/tailwind";
import { Icon } from "@/features/common/ui/icon";
import { Badge } from "@/features/common/ui/badge";
import { PawTag } from "@/features/media/components/common/paw-tag";
import PlayIcon from "@/assets/icons/play.svg";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useIsFocused } from "expo-router";
import { Image } from "expo-image";
import { useScreenDimensions } from "@/hooks/use-screen-dimensions";

type Props = {
  YTKey: string;
  inScreen: boolean;
  autoplay: boolean;
  onPlay: () => void;
  onPause: () => void;
  fullWidth?: boolean;
  backdropPath: string | undefined;
  errorMessagePlacement?: "top" | "bottom";
  tag?: string;
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
  backdropPath,
  errorMessagePlacement = "bottom",
  tag,
}: Props) => {
  return (
    <View className={"max-h-[230px] w-full flex-1 tall-sm:max-h-[280px]"}>
      {tag ? <PawTag text={tag} inScreen={inScreen} /> : null}
      <Player
        key={YTKey}
        YTKey={YTKey}
        autoplay={autoplay}
        onPlay={onPlay}
        onPause={onPause}
        fullWidth={fullWidth}
        inScreen={inScreen}
        backdropPath={backdropPath}
        errorMessagePlacement={errorMessagePlacement}
      />
    </View>
  );
};

const RETRY_ATTEMPTS = 1;

// Zooming until a 2.39:1 picture fills the box hides the black bars many trailers have.
// EXTRA_ZOOM crops a little more on top, picked by eye on a phone.
const WIDE_TRAILER_RATIO = 2.39;
const EXTRA_ZOOM = 1.03;

/**
 * The player itself.
 */
export const Player = ({
  YTKey,
  autoplay,
  onPlay,
  onPause,
  fullWidth,
  inScreen,
  backdropPath,
  errorMessagePlacement = "bottom",
}: Props) => {
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

  const [canNotPlay, setCanNotPlay] = useState(false); // prevent flicker
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [userTriggeredPlay, setUserTriggeredPlay] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const isFocused = useIsFocused();

  const wantsToPlay = autoplay || userTriggeredPlay;

  const shouldPlay =
    isReady &&
    isFocused &&
    appState === "active" &&
    inScreen &&
    allowYTPlaying &&
    wantsToPlay;

  useEffect(() => {
    if (!inScreen || !isFocused || appState !== "active") {
      setUserTriggeredPlay(false);
    }
  }, [inScreen, isFocused, appState]);

  // Handle external volume changes to unmute
  useEffect(() => {
    let volumeListener: { remove: () => void } | null = null;
    let isMounted = true;

    // getVolume never fails on iOS: the native side only ever resolves.
    void VolumeManager.getVolume().then(({ volume: initialVolume }) => {
      if (!isMounted) return; // in case the user left the screen with this component before the promise to fetch the volume resolves

      let currentVolume = initialVolume;
      volumeListener = VolumeManager.addVolumeListener(
        ({ volume: newVolume }) => {
          if (newVolume > currentVolume) {
            setYtMuted(false);
          }
          currentVolume = newVolume;
        },
      );
    });

    return () => {
      isMounted = false;
      if (volumeListener) {
        volumeListener.remove();
      }
    };
  }, [setYtMuted]);

  // Sync mute state to the player.
  // The player's calls never fail: each one only sends a message to the player and resolves.
  useEffect(() => {
    if (ytMuted) {
      void player.mute();
    } else {
      void player.unMute();
    }
  }, [ytMuted, player]);

  // Player events
  useYouTubeEvent(player, "ready", () => {
    setIsReady(true);
  });

  useYouTubeEvent(player, "stateChange", (state) => {
    setIsPlaying(state === PlayerState.PLAYING);
    if (state === PlayerState.PLAYING) {
      setHasStartedPlaying(true);
    }
    // We also play and pause the player when shouldPlay changes (scroll, screen change).
    // Only a change that goes against shouldPlay came from a tap on the video.
    if (state === PlayerState.PLAYING && !shouldPlay) {
      setUserTriggeredPlay(true);
      onPlay();
    } else if (state === PlayerState.PAUSED && shouldPlay) {
      setUserTriggeredPlay(false);
      onPause();
    }
  });

  // A retry changes the YouTube view's key, which loads the player again.
  const retryOrGiveUp = useCallback(() => {
    if (retryCount < RETRY_ATTEMPTS) {
      setRetryCount(retryCount + 1);
      return;
    }
    setCanNotPlay(true);
  }, [retryCount]);

  useYouTubeEvent(player, "error", retryOrGiveUp);

  // Fallback timeout in case isReady never fires
  useEffect(() => {
    if (isReady || canNotPlay) return;
    const timer = setTimeout(retryOrGiveUp, 5_000);
    return () => clearTimeout(timer);
  }, [isReady, canNotPlay, retryOrGiveUp]);

  // Play/pause based on shouldPlay state
  useEffect(() => {
    if (shouldPlay) {
      void player.play();
    } else {
      void player.pause();
    }
  }, [shouldPlay, player]);

  const { width: w } = useScreenDimensions();
  const width = fullWidth ? w : w - 2 * Number(tailwind.theme.spacing[4]); // * 2 for both side padding
  const [boxHeight, setBoxHeight] = useState(0);
  const zoom = (boxHeight * WIDE_TRAILER_RATIO * EXTRA_ZOOM) / width;

  const placeholderOpacity = useSharedValue(1);

  const isVideoVisible =
    !canNotPlay && isReady && (hasStartedPlaying || isPlaying);

  useEffect(() => {
    placeholderOpacity.value = withTiming(isVideoVisible ? 0 : 1, {
      duration: 500,
    });
  }, [isVideoVisible, placeholderOpacity]);

  const placeholderStyle = useAnimatedStyle(() => ({
    opacity: placeholderOpacity.value,
  }));

  const handlePlaceholderPress = () => {
    if (wantsToPlay) return;
    setUserTriggeredPlay(true);
    onPlay();
    if (isReady) {
      void player.play();
    }
  };

  return (
    <View className="relative h-full w-full">
      <View className="flex h-full w-full items-center justify-center">
        {!canNotPlay && (
          <View
            style={{ width }}
            onLayout={(event) => setBoxHeight(event.nativeEvent.layout.height)}
            className={cn(
              "h-full items-center justify-center overflow-hidden",
              fullWidth ? "rounded-none" : "rounded-xl",
            )}
          >
            <YoutubeView
              key={retryCount}
              player={player}
              height={340}
              width={width}
              style={{
                width,
                height: 340,
                transform: [{ scale: zoom }],
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
        )}
      </View>

      <Animated.View
        style={placeholderStyle}
        pointerEvents={isVideoVisible ? "none" : "auto"}
        className="absolute inset-0 h-full w-full"
      >
        <TrailerPlaceholder
          fullWidth={fullWidth}
          backdropPath={backdropPath}
          showPlayIcon={
            !canNotPlay &&
            isReady &&
            Boolean(backdropPath) &&
            !hasStartedPlaying &&
            !wantsToPlay
          }
          isLoading={!canNotPlay && !isReady}
          onPress={canNotPlay ? undefined : handlePlaceholderPress}
        />
      </Animated.View>

      {canNotPlay && (
        <View
          className={cn(
            "absolute inset-x-0 items-center",
            errorMessagePlacement === "top" && "top-4",
            errorMessagePlacement === "bottom" && "bottom-4",
          )}
        >
          <Badge text="There is no trailer :(" variant={"dirty"} faint />
        </View>
      )}
    </View>
  );
};

type TrailerPlaceholderProps = {
  backdropPath: string | undefined;
  fullWidth: boolean | undefined;
  showPlayIcon: boolean | undefined;
  isLoading?: boolean | undefined;
  onPress: (() => void) | undefined;
};

const TrailerPlaceholder = ({
  backdropPath,
  fullWidth = false,
  showPlayIcon = false,
  isLoading = false,
  onPress,
}: TrailerPlaceholderProps) => {
  return (
    <Pressable onPress={onPress} className="h-full w-full">
      <View
        className={cn(
          "h-full w-full items-center justify-center overflow-hidden",
          fullWidth ? "rounded-none" : "rounded-xl",
        )}
      >
        <Image
          source={backdropPath}
          contentFit="cover"
          transition={300}
          style={{ width: "100%", height: "100%" }}
        />
        {(showPlayIcon || isLoading) && (
          <View className="absolute h-full w-full items-center justify-center bg-neutral-15-default/30">
            {isLoading && <ActivityIndicator size="large" color="white" />}
            {showPlayIcon && <Icon i={PlayIcon} width={64} height={64} />}
          </View>
        )}
      </View>
    </Pressable>
  );
};
