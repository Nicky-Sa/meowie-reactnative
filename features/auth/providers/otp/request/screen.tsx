import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IntroText } from "@/features/auth/providers/otp/request/intro-text";
import { EmailForm } from "@/features/auth/providers/otp/request/email-form";
import { useVideoPlayer, VideoView } from "expo-video";
import { SkipAuth } from "@/features/auth/providers/otp/request/skip-auth";
import { ThirdPartyAuthButtons } from "@/features/auth/providers/third-party/third-party-auth-buttons";
import { ScrollView } from "react-native-gesture-handler";

const ONLINE_VIDEO_URI =
  "https://meowie-public.s3.eu-central-1.amazonaws.com/signup-video.mp4";

export const Screen = () => {
  const player = useVideoPlayer(ONLINE_VIDEO_URI, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });
  return (
    <View className={"flex-1"}>
      {/* Video and Overlay - No changes here */}
      <VideoView
        player={player}
        contentFit="cover"
        nativeControls={false}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 0,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 0,
        }}
      />
      <SafeAreaView className="flex-1">
        {/*using ScrollView to handle keyboard */}
        <ScrollView
          contentContainerClassName={"flex-1 flex-col justify-between px-4"}
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled"
        >
          <IntroText />
          <View className={"flex flex-col gap-4"}>
            <EmailForm />

            <View className="my-2 flex flex-row items-center">
              <View className="h-px flex-1 bg-white/20" />
              <View>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    marginHorizontal: 10,
                  }}
                >
                  or
                </Text>
              </View>
              <View className="h-px flex-1 bg-white/20" />
            </View>

            <ThirdPartyAuthButtons />
            <SkipAuth />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
