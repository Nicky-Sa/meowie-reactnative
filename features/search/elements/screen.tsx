import { View } from "react-native";
import { SearchInput } from "@/features/search/elements/search-input";
import { useMultiSearchQuery } from "@/features/search/data/useMultiSearchQuery";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/features/common/ui/button";
import { SearchResultList } from "@/features/search/elements/list";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export const Screen = () => {
  const { query = "" } = useLocalSearchParams<{ query: string }>();
  const router = useRouter();
  const [isDebouncing, setIsDebouncing] = useState(false);
  const { data, isLoading, error, mutate } = useMultiSearchQuery({ query });

  return (
    <SafeAreaView
      className={"flex flex-1 flex-col justify-between px-4 pt-4"}
      edges={["top", "left", "right"]}
    >
      <View
        className={"flex w-full flex-row items-center justify-between gap-3"}
      >
        <View className={"flex-grow"}>
          <SearchInput currentQuery={query} setIsDebouncing={setIsDebouncing} />
        </View>
        <Button
          onPress={() => router.back()}
          variant={"link"}
          size={"lg"}
          iconOnly
        >
          Cancel
        </Button>
      </View>

      <SearchResultList
        debouncedQuery={query}
        data={data}
        isLoading={isLoading || isDebouncing}
        error={error}
        mutate={mutate}
      />
    </SafeAreaView>
  );
};
