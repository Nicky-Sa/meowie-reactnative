import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { Guest } from "@/features/profile/guest/content";
import { View } from "react-native";
import { MainScreen } from "@/features/common/layout/main-screen";
import { LoggedIn } from "@/features/profile/logged-in/content";
import { useScrollHandler } from "@/features/common/hooks/list/useScrollHandler";
import { Header } from "@/features/profile/header";

export const Screen = () => {
  const { data } = useCurrentUser();
  const { scrollY, scrollHandler } = useScrollHandler();

  return (
    <MainScreen>
      <Header scrollY={scrollY} />
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
