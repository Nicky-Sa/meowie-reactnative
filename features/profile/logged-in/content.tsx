import { View, Text } from "react-native";
import { useMainContentStyle } from "@/features/common/hooks/useMainContentStyle";
import { Header } from "@/features/movies/layout/header";
import { Image } from "expo-image";
import { MainScreen } from "@/features/common/layout/main-screen";
import TMDBGrayLogo from "@/assets/icons/tmdb-gray.svg";
import { ProfileHeaderButton } from "@/features/profile/header-button";

export const Content = () => {
  const contentStyle = useMainContentStyle();
  return (
    <MainScreen>
      <Header headerButton={<ProfileHeaderButton />} />
      <View
        style={contentStyle}
        className={"flex flex-col justify-between px-4"}
      >
        <View className={"flex flex-grow flex-col gap-4"}>
          <Image
            source={
              "https://meowie-public.s3.eu-central-1.amazonaws.com/default-profile.png"
            }
            style={{
              width: 100,
              height: 100,
              borderRadius: 9999,
            }}
            contentFit="cover"
          />
          <Text className={"body-b2 text-neutral-10-default"}>
            Welcome to your profile
          </Text>
          <Text className={"title-t1-strong text-neutral-10-default"}>
            Benjamin@gmail.com
          </Text>
        </View>
        <View
          className={
            "m-auto flex w-[70%] flex-row items-center justify-center gap-3"
          }
        >
          <TMDBGrayLogo />
          <Text className={"caption-c1 shrink text-neutral-3-default"}>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </Text>
        </View>
      </View>
    </MainScreen>
  );
};
