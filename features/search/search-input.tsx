import { Dispatch, SetStateAction, useEffect } from "react";
import { Search } from "iconoir-react-native";
import { TextInput } from "@/features/common/form/text-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "expo-router";

const SearchSchema = z.object({
  query: z.string(),
});

type SearchFormData = z.infer<typeof SearchSchema>;

type Props = {
  currentQuery: string;
  setHasEnteredInput: Dispatch<SetStateAction<boolean>>;
};

export const SearchInput = ({ currentQuery, setHasEnteredInput }: Props) => {
  const router = useRouter();

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
    setHasEnteredInput(queryValue.trim() !== "");
  }, [queryValue, setHasEnteredInput]);

  // Sync debounced value to URL
  useEffect(() => {
    router.setParams({ query: debouncedQuery });
  }, [debouncedQuery, router]);

  return (
    <TextInput
      name={"query"}
      control={control}
      size={"md"}
      clearErrors={clearErrors}
      placeholder={"Search movie, actor, genre"}
      autoCapitalize={"none"}
      autoCorrect={false}
      icon={Search}
    />
  );
};
