import { useQueryConfigured } from "@/features/common/data/query/hooks";
import { JourneyResDto } from "@/features/taste/data/dto/journey.dto";

export const useFetchJourney = () => {
  const { data: response, ...rest } =
    useQueryConfigured<JourneyResDto>("/taste/journey");

  return { data: response?.data, ...rest };
};
