import { useEffect, useState, useRef } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
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
import { Icon } from "@/features/common/ui/icon";
import YoutubeLogo from "@/assets/icons/youtube.svg";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useIsFocused } from "expo-router/react-navigation";
import { Image } from "expo-image";
import { useScreenDimensions } from "@/hooks/useScreenDimensions";

type Props = {
  YTKey: string;
  inScreen: boolean;
  autoplay: boolean;
  onPlay: () => void;
  onPause: () => void;
  fullWidth?: boolean;
  backdropPath: string | undefined;
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
}: Props) => {
  return (
    <View className={"h-[200px] w-full"}>
      <Player
        key={YTKey}
        YTKey={YTKey}
        autoplay={autoplay}
        onPlay={onPlay}
        onPause={onPause}
        fullWidth={fullWidth}
        inScreen={inScreen}
        backdropPath={backdropPath}
      />
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
  inScreen,
  backdropPath,
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
  const retryAttemptRef = useRef(0);
  const isFocused = useIsFocused();

  const willAutoplay = autoplay && allowYTPlaying;

  const shouldPlay =
    isReady &&
    isFocused &&
    appState === "active" &&
    inScreen &&
    (willAutoplay || userTriggeredPlay);

  useEffect(() => {
    if (!inScreen || !isFocused || appState !== "active") {
      setUserTriggeredPlay(false);
    }
  }, [inScreen, isFocused, appState]);

  // Handle external volume changes to unmute
  useEffect(() => {
    let volumeListener: { remove: () => void } | null = null;
    let isMounted = true;

    VolumeManager.getVolume().then(({ volume: initialVolume }) => {
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
    setIsPlaying(state === PlayerState.PLAYING);
    if (state === PlayerState.PLAYING) {
      setHasStartedPlaying(true);
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

  // Fallback timeout in case isReady never fires
  useEffect(() => {
    if (isReady || canNotPlay) return;
    const timer = setTimeout(() => {
      setCanNotPlay(true);
    }, 5_000);
    return () => clearTimeout(timer);
  }, [isReady, canNotPlay]);

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

  const placeholderOpacity = useSharedValue(1);

  const isVideoVisible =
    canNotPlay || (isReady && (hasStartedPlaying || isPlaying));

  useEffect(() => {
    placeholderOpacity.value = withTiming(isVideoVisible ? 0 : 1, {
      duration: 500,
    });
  }, [isVideoVisible, placeholderOpacity]);

  const placeholderStyle = useAnimatedStyle(() => ({
    opacity: placeholderOpacity.value,
  }));

  const handlePlaceholderPress = () => {
    setUserTriggeredPlay(true);
    if (isReady) {
      player.play();
    }
  };

  return (
    <View className="relative h-full w-full">
      <View className="flex h-full w-full items-center justify-center">
        {canNotPlay ? (
          <TrailerError fullWidth={fullWidth} />
        ) : (
          <View
            style={{ width }}
            className={cn(
              "h-[200px] items-center justify-center overflow-hidden",
              fullWidth ? "rounded-none" : "rounded-xl",
            )}
          >
            <YoutubeView
              player={player}
              height={340}
              width={width}
              style={{
                width,
                height: 340,
                transform: [{ scale: 1.35 }],
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
        className="absolute inset-0 z-10 h-full w-full"
      >
        <TrailerPlaceholder
          fullWidth={fullWidth}
          backdropPath={backdropPath}
          showLogo={
            isReady &&
            Boolean(backdropPath) &&
            !hasStartedPlaying &&
            !willAutoplay &&
            !userTriggeredPlay
          }
          isLoading={!isReady}
          onPress={handlePlaceholderPress}
        />
      </Animated.View>
    </View>
  );
};

const TrailerPlaceholder = ({
  backdropPath,
  fullWidth = false,
  showLogo = false,
  isLoading = false,
  onPress,
}: {
  backdropPath: string | undefined;
  fullWidth: boolean | undefined;
  showLogo: boolean | undefined;
  isLoading?: boolean | undefined;
  onPress: (() => void) | undefined;
}) => {
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
        {(showLogo || isLoading) && (
          <View className="absolute h-full w-full items-center justify-center bg-neutral-15-default/30">
            {isLoading ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <Icon i={YoutubeLogo} width={88} height={88} />
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

const TrailerError = ({ fullWidth }: { fullWidth: boolean | undefined }) => {
  return (
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
  );
};
