import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { APP_STORE_LOOKUP_URL } from "@/lib/consts";
import { AppStoreLookupResDto } from "@/features/general/update-check/data/dto/app-store-lookup.dto";

const fetchAppStoreLookup = async () => {
  const response = await fetch(APP_STORE_LOOKUP_URL);
  if (!response.ok) {
    throw new Error(`App Store lookup failed with status ${response.status}`);
  }
  return response.json();
};

export const useFetchLatestVersionNumber = () => {
  const query = useQuery<AppStoreLookupResDto, Error, string | undefined>({
    queryKey: [APP_STORE_LOOKUP_URL],
    queryFn: fetchAppStoreLookup,
    select: (lookup) => lookup.results[0]?.version,
  });

  useEffect(() => {
    if (query.error) {
      console.error("Couldn't load the latest App Store version:", query.error);
    }
  }, [query.error]);

  return query;
};
