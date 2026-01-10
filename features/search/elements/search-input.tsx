import { Dispatch, SetStateAction, useEffect } from "react";
import { Search } from "iconoir-react-native";
import { TextInput } from "@/features/common/form/text-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "expo-router";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";

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
  const { capture } = useCaptureEvent();

  const { control, watch, clearErrors } = useForm<SearchFormData>({
    resolver: zodResolver(SearchSchema),
    mode: "onChange",
    defaultValues: {
      query: currentQuery, // Initialize from URL
    },
  });

  const queryValue = watch("query");
  const debouncedQuery = useDebounce(queryValue, 2000);

  useEffect(() => {
    setIsDebouncing(queryValue !== debouncedQuery);
  }, [debouncedQuery, queryValue, setIsDebouncing]);

  // Sync debounced value to URL
  useEffect(() => {
    if (debouncedQuery) {
      capture("search_submitted", { query: debouncedQuery });
    }
    router.setParams({ query: debouncedQuery });
  }, [capture, debouncedQuery, router]);

  return (
    <TextInput
      name={"query"}
      control={control}
      size={"md"}
      clearErrors={clearErrors}
      placeholder={"Search movie, actor, genre"}
      autoCapitalize={"none"}
      autoCorrect={false}
      autoFocus
      icon={Search}
    />
  );
};
