import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IntroText } from "@/features/auth/request-otp/intro-text";
import { EmailForm } from "@/features/auth/request-otp/email-form";
import { useVideoPlayer, VideoView } from "expo-video";

const ONLINE_VIDEO_URI =
  "https://imdb-video.media-imdb.com/vi324468761/1434659607842-pgv4ql-1563712918369.mp4?Expires=1762802271&Signature=UDA64HHbroGUhSv~RcOKSfx41R6LGDCf3yVeB0YxrHgqw0Ny31dnm7afa9aahQxRsHtNtQAMrb2QqgpwOoWL9WGOLfV-Bv2oaJInSSK~CX4oUF0YdoXRaAEFQt8Dk67jOO0V0bQBJFBk7zUckVRq9xp22kOmLXvhyzz1KLIBDnCU7UDsyZwwhRl1MlWcGwUIx14ySBL4CVVSZ3TkEVTTQZ77Kvbwf5UvktKHeA-ozN8z5zpzpQ0ORf-InY5OB5uPNXc2IqKU6k977yGko1iWaJ7S-HuCIjMVlbxqcrGsOBNuTzF28gfqwpHHub5AJinyGBp88L4vA69t38AbeJxNPw__&Key-Pair-Id=APKAIFLZBVQZ24NQH3KA";

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
