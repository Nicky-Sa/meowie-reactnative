import { View } from "react-native";
import { MainScreen } from "@/features/common/layout/main-screen";
import { SearchInput } from "@/features/search/search-input";
import { useMultiSearchQuery } from "@/features/search/data/useMultiSearchQuery";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/features/common/button";
import { Icon } from "@/features/common/icon";
import { Filter } from "iconoir-react-native";
import { SearchResultList } from "@/features/search/elements/search-result-list";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export const Screen = () => {
  const { query = "" } = useLocalSearchParams<{ query: string }>();
  const router = useRouter();
  const [hasEnteredInput, setHasEnteredInput] = useState(false);
  const { data, isLoading } = useMultiSearchQuery({ query });

  return (
    <MainScreen>
      <SafeAreaView
        className={"flex flex-1 flex-col justify-between px-4 pt-4"}
        edges={["top", "left", "right"]}
      >
        <View className={"flex w-full flex-row items-center justify-between"}>
          <View className={"flex-grow"}>
            <SearchInput
              currentQuery={query}
              setHasEnteredInput={setHasEnteredInput}
            />
          </View>
          {!hasEnteredInput && (
            <Button
              onPress={() => router.push("/filters")}
              variant={"ghost"}
              size={"md"}
              iconOnly
            >
              <Icon i={Filter} />
            </Button>
          )}
        </View>

        <SearchResultList
          debouncedQuery={query}
          hasEnteredInput={hasEnteredInput}
          data={data}
          isLoading={isLoading}
        />
      </SafeAreaView>
    </MainScreen>
  );
};
