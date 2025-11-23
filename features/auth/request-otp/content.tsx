import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IntroText } from "@/features/auth/request-otp/intro-text";
import { EmailForm } from "@/features/auth/request-otp/email-form";
import { useVideoPlayer, VideoView } from "expo-video";
import { SkipAuth } from "@/features/auth/request-otp/skip-auth";

const ONLINE_VIDEO_URI =
  "https://meowie-public.s3.eu-central-1.amazonaws.com/signup-video.mp4";

export const Content = () => {
  const player = useVideoPlayer(ONLINE_VIDEO_URI, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });
  return (
    <View style={{ flex: 1 }}>
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className={"flex-1 flex-col justify-between px-4"}>
            <IntroText />
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View className={"flex flex-col gap-4"}>
                <EmailForm />
                <SkipAuth />
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </View>
  );
};
