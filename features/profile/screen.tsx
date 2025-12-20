import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { LoggedIn } from "@/features/profile/logged-in";
import { Guest } from "@/features/profile/guest";
import { View, Text } from "react-native";
import TMDBGrayLogo from "@/assets/icons/tmdb-gray.svg";
import { Header } from "@/features/general/layout/header";
import { ProfileHeaderButton } from "@/features/profile/header-button";
import { MainScreen } from "@/features/common/layout/main-screen";
import { useMainScreenContentStyle } from "@/features/common/hooks/useMainScreenContentStyle";
import { Skeleton } from "@/features/profile/skeleton";

export const Screen = () => {
  const contentStyle = useMainScreenContentStyle();
  const { data, isLoading } = useCurrentUser();

  return (
    <MainScreen>
      <Header headerButton={<ProfileHeaderButton />} />
      <View
        style={contentStyle}
        className={"flex flex-col justify-between px-4"}
      >
        <View className={"flex flex-grow flex-col items-start gap-4"}>
          {isLoading ? (
            <Skeleton />
          ) : data?.user ? (
            <LoggedIn user={data.user} />
          ) : (
            <Guest />
          )}
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
