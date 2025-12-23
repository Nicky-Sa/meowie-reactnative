import { Keyboard, View } from "react-native";
import { MainScreen } from "@/features/common/layout/main-screen";
import { SearchInput } from "@/features/search/elements/search-input";
import { useMultiSearchQuery } from "@/features/search/data/useMultiSearchQuery";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/features/common/button";
import { Icon } from "@/features/common/icon";
import { Filter } from "iconoir-react-native";
import { SearchResultList } from "@/features/search/elements/result/search-result-list";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export const Screen = () => {
  const { query = "" } = useLocalSearchParams<{ query: string }>();
  const router = useRouter();
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [immediateQuery, setImmediateQuery] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const { data, isLoading } = useMultiSearchQuery({ query });

  return (
    <MainScreen>
      <SafeAreaView
        className={"flex flex-1 flex-col justify-between px-4 pt-4"}
        edges={["top", "left", "right"]}
      >
        <View
          className={"flex w-full flex-row items-center justify-between gap-3"}
        >
          <View className={"flex-grow"}>
            <SearchInput
              currentQuery={query}
              setIsDebouncing={setIsDebouncing}
              setImmediateQuery={setImmediateQuery}
              setIsFocused={setIsFocused}
            />
          </View>
          {isFocused ? (
            <Button
              onPress={() => Keyboard.dismiss()}
              variant={"link"}
              size={"lg"}
              iconOnly
            >
              Cancel
            </Button>
          ) : (
            !immediateQuery && (
              <Button
                onPress={() => router.push("/filters")}
                variant={"ghost"}
                size={"md"}
                iconOnly
              >
                <Icon i={Filter} />
              </Button>
            )
          )}
        </View>

        <SearchResultList
          debouncedQuery={query}
          data={data}
          isLoading={isLoading || isDebouncing}
        />
      </SafeAreaView>
    </MainScreen>
  );
};
