import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { Guest } from "@/features/profile/guest/content";
import { View } from "react-native";
import { Header } from "@/features/general/layout/header";
import { ProfileHeaderButton } from "@/features/profile/header-button";
import { MainScreen } from "@/features/common/layout/main-screen";
import { LoggedIn } from "@/features/profile/logged-in/content";
import { useScrollHandler } from "@/features/browse/hooks/list/useScrollHandler";

export const Screen = () => {
  const { data } = useCurrentUser();
  const { scrollY, scrollHandler } = useScrollHandler();

  return (
    <MainScreen>
      <Header scrollY={scrollY} headerButton={<ProfileHeaderButton />} />
      <View className={"flex-1"}>
        {data?.user ? (
          <LoggedIn
            scrollY={scrollY}
            scrollHandler={scrollHandler}
            user={data.user}
          />
        ) : (
          <Guest scrollY={scrollY} />
        )}
      </View>
    </MainScreen>
  );
};
