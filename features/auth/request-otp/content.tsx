import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IntroText } from "@/features/auth/request-otp/intro-text";
import { EmailForm } from "@/features/auth/request-otp/email-form";
import { useVideoPlayer, VideoView } from "expo-video";

const ONLINE_VIDEO_URI =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const Content = () => {
  const player = useVideoPlayer(ONLINE_VIDEO_URI, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });
  return (
    <View style={{ flex: 1 }}>
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
      {/*Dark overlay on the video*/}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          zIndex: 0,
        }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className={"z-[2] flex-1 bg-transparent p-4"}>
          <SafeAreaView>
            <View className={"flex h-full flex-col justify-between"}>
              <IntroText />
              <EmailForm />
            </View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
