import { useCurrentUser } from "@/features/general/data/use-current-user";
import { Guest } from "@/features/profile/guest/content";
import { View } from "react-native";
import { MainScreen } from "@/features/common/layout/main-screen";
import { LoggedIn } from "@/features/profile/logged-in/content";
import { useScrollHandler } from "@/features/common/hooks/list/use-scroll-handler";
import { Header } from "@/features/profile/header";
import { Loading } from "@/features/profile/loading/content";

export const Screen = () => {
  const { data, isLoading } = useCurrentUser();
  const { scrollY, scrollHandler } = useScrollHandler();

  return (
    <MainScreen>
      <Header scrollY={scrollY} />
      <View className={"flex-1"}>
        {isLoading ? (
          <Loading scrollY={scrollY} />
        ) : !data?.user ? (
          <Guest scrollY={scrollY} />
        ) : (
          <LoggedIn
            scrollY={scrollY}
            scrollHandler={scrollHandler}
            user={data.user}
          />
        )}
      </View>
    </MainScreen>
  );
};
