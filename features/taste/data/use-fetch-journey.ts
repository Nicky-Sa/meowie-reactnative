import { useQueryConfigured } from "@/features/common/data/query/hooks";
import { JourneyResDto } from "@/features/taste/data/dto/journey.dto";

export const useFetchJourney = () => {
  // The backend shuffles the pools per request, so a refetch part-way through
  // would reorder the deck under the user. One fetch holds for the whole run.
  const { data: response, ...rest } = useQueryConfigured<JourneyResDto>(
    "/taste/journey",
    { staleTime: Infinity },
  );

  return { data: response?.data, ...rest };
};
