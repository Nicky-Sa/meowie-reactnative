import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { LoggedIn } from "@/features/profile/logged-in";
import { Guest } from "@/features/profile/guest/content";
import { View } from "react-native";
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
      <View style={contentStyle} className={"flex-1"}>
        {isLoading ? (
          <Skeleton />
        ) : data?.user ? (
          <LoggedIn user={data.user} />
        ) : (
          <Guest />
        )}
      </View>
    </MainScreen>
  );
};
