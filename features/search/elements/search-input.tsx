import { Dispatch, SetStateAction, useEffect } from "react";
import { Search } from "iconoir-react-native";
import { TextInput } from "@/features/common/form/text-input";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "expo-router";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

const SearchSchema = z.object({
  query: z.string(),
});

type SearchFormData = z.infer<typeof SearchSchema>;

type Props = {
  currentQuery: string;
  setIsDebouncing: Dispatch<SetStateAction<boolean>>;
};

export const SearchInput = ({ currentQuery, setIsDebouncing }: Props) => {
  const router = useRouter();
  const { discovery } = useAnalytics();

  const { control, clearErrors } = useForm<SearchFormData>({
    resolver: zodResolver(SearchSchema),
    mode: "onChange",
    defaultValues: {
      query: currentQuery, // Initialize from URL
    },
  });

  const queryValue = useWatch({ control, name: "query" });
  const debouncedQuery = useDebounce(queryValue, 2000);

  useEffect(() => {
    setIsDebouncing(queryValue !== debouncedQuery);
  }, [debouncedQuery, queryValue, setIsDebouncing]);

  // Sync debounced value to URL
  useEffect(() => {
    if (debouncedQuery) {
      discovery.trackSearch({ query: debouncedQuery });
    }
    router.setParams({ query: debouncedQuery });
  }, [discovery, debouncedQuery, router]);

  return (
    <TextInput
      name={"query"}
      control={control}
      size={"md"}
      clearErrors={clearErrors}
      placeholder={"Search anything..."}
      autoCapitalize={"none"}
      autoCorrect={false}
      autoFocus
      icon={Search}
    />
  );
};
