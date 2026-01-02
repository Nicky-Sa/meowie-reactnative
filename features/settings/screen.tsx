import { View } from "react-native";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { TermsConditions } from "@/features/settings/items/terms-conditions";
import { PrivacyPolicy } from "@/features/settings/items/privacy-policy";
import { DeleteAccount } from "@/features/settings/items/delete-account";
import { Logout } from "@/features/settings/items/logout";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { EmptyCache } from "@/features/settings/items/empty-cache";
import { Title } from "@/features/settings/elements/tilte";
import { Autoplay } from "@/features/settings/items/autoplay";
import { TMDBStatement } from "@/features/settings/items/tmdb-statement";

export const Screen = () => {
  const { data } = useCurrentUser();
  const isLoggedIn = data?.user !== null;
  return (
    <InnerScreen title={"Settings"}>
      <View className={"flex w-full flex-col gap-8"}>
        <View className={"flex w-full flex-col gap-8"}>
          <View className={"flex flex-col gap-2"}>
            <Title>App</Title>
            <Autoplay />
            <EmptyCache />
          </View>
          <View className={"flex flex-col gap-2"}>
            <Title>Account</Title>
            <TermsConditions />
            <PrivacyPolicy />
            {isLoggedIn && (
              <>
                <DeleteAccount />
                <Logout />
              </>
            )}
          </View>
          <TMDBStatement />
        </View>
      </View>
    </InnerScreen>
  );
};
